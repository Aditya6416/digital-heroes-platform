-- =====================================================================
-- DIGITAL HEROES PLATFORM - SUPABASE SCHEMA (Level 1 Edition 2026)
-- A subscription-driven web application combining golf performance tracking,
-- charity fundraising, and a monthly draw-based reward engine.
-- =====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('visitor', 'subscriber', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'lapsed');
CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_mode AS ENUM ('random', 'algorithmic');
CREATE TYPE draw_status AS ENUM ('draft', 'simulated', 'published');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payout_status AS ENUM ('pending', 'paid');

-- 3. USERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'subscriber',
  avatar_url TEXT,
  phone TEXT,
  handicap NUMERIC(4,1) DEFAULT 18.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  hero_image_url TEXT,
  website TEXT,
  total_raised NUMERIC(12,2) DEFAULT 0.00,
  is_featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHARITY EVENTS (e.g., Charity Golf Days)
CREATE TABLE IF NOT EXISTS public.charity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  registration_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'monthly',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  cancel_at_period_end BOOLEAN DEFAULT false,
  selected_charity_id UUID REFERENCES public.charities(id),
  charity_percentage NUMERIC(5,2) NOT NULL DEFAULT 15.00 CHECK (charity_percentage >= 10.00),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GOLF SCORES TABLE
-- Stableford format (1-45), strictly one score per user per date
CREATE TABLE IF NOT EXISTS public.golf_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_on DATE NOT NULL,
  course_name TEXT DEFAULT 'Local Golf Course',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_score_date UNIQUE (user_id, played_on)
);

-- 8. MONTHLY DRAWS TABLE
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month_label TEXT NOT NULL, -- e.g. "October 2026"
  scheduled_date TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  mode draw_mode NOT NULL DEFAULT 'random',
  status draw_status NOT NULL DEFAULT 'draft',
  winning_numbers INTEGER[] CHECK (array_length(winning_numbers, 1) = 5),
  total_pool NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  jackpot_rollover_in NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  jackpot_rollover_out NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tier_5_share NUMERIC(12,2) DEFAULT 0.00, -- 40% + rollover
  tier_4_share NUMERIC(12,2) DEFAULT 0.00, -- 35%
  tier_3_share NUMERIC(12,2) DEFAULT 0.00, -- 25%
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DRAW WINNERS & PRIZES
CREATE TABLE IF NOT EXISTS public.draw_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_count INTEGER NOT NULL CHECK (matched_count IN (3, 4, 5)),
  matched_numbers INTEGER[] NOT NULL,
  user_scores_snapshot INTEGER[] NOT NULL,
  prize_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  payout_status payout_status NOT NULL DEFAULT 'pending',
  proof_image_url TEXT,
  proof_submitted_at TIMESTAMPTZ,
  admin_notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DIRECT DONATIONS (Not tied to gameplay)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_golf_scores_user_date ON public.golf_scores(user_id, played_on DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_winners_user ON public.draw_winners(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_winners_draw ON public.draw_winners(draw_id);

-- 12. AUTOMATIC 5-SCORE ROLLING PRUNING FUNCTION
-- Enforces: "Only the latest 5 scores are retained at any time. A new score replaces the oldest stored score automatically."
CREATE OR REPLACE FUNCTION prune_excess_golf_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.golf_scores
  WHERE id IN (
    SELECT id FROM public.golf_scores
    WHERE user_id = NEW.user_id
    ORDER BY played_on DESC, created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prune_golf_scores ON public.golf_scores;
CREATE TRIGGER trg_prune_golf_scores
AFTER INSERT ON public.golf_scores
FOR EACH ROW
EXECUTE FUNCTION prune_excess_golf_scores();
