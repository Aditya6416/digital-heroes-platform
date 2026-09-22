# Digital Heroes Platform (Level 1 — Edition 2026)

> **"Feel, not fairway."**  
> A subscription-driven full-stack web application combining golf performance tracking in Stableford format, charity fundraising, and a monthly draw-based reward engine with jackpot rollovers.

Built to strictly fulfill all requirements of the **Digital Heroes Product Requirements Document (PRD Version 1.0, March 2026)**.

---

## ⚡ Evaluator Quick Start & Test Credentials

The application is pre-seeded with rich data and comes with an **Evaluator Quick Switcher Bar** pinned to the top of the interface for instantaneous 1-click persona switching:

| Persona | Email | Password | Pre-seeded State & Capabilities |
| :--- | :--- | :--- | :--- |
| **Subscriber** | `subscriber@digitalheroes.com` | `password123` | **Alex Montgomery**: Active monthly subscription, 5 rolling scores entered, selected charity (Youth on Course, 15%), **September 5-Number Match Grand Jackpot Winner** ($41,400) ready for score proof upload & verification. |
| **Administrator** | `admin@digitalheroes.com` | `admin123` | **Elena Vance**: Full access to all 5 admin surfaces (§ 11): Draw Engine simulation & publishing, Winner verification & payout approval, User & score overrides, and Charity CRUD. |
| **Public Visitor** | *(Anonymous)* | *(None)* | Public concept explorer, charity directory, draw mechanics, and subscription onboarding flow. |

---

## 🛠️ Architecture & Technology Stack

- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling & Design System**: Modern CSS with Tailwind CSS, custom glassmorphism, responsive editorial grid, and micro-interactions adhering to *"Feel, not fairway"* (dark palette `#0a0d14`, emerald highlights, gold jackpot accents, zero traditional golf plaid/clichés).
- **Icons**: Lucide React
- **Database & Backend**:
  - Full PostgreSQL schema with automated triggers: `supabase/schema.sql`
  - Dual-mode data layer: Connects to live Supabase via `.env.local` or operates offline seamlessly with client/localStorage seed sync.
- **Testing**: Automated business logic test suite (`test-engine.cjs`).

---

## 📋 PRD Specifications & Feature Mapping

### 1. Subscription & Payment System (§ 04)
- **Plans**: Monthly ($19/mo) and Yearly ($180/yr — 21% discount).
- **Access Control**: Public visitors receive restricted access; subscribers unlock score entry and draw participation.
- **Lifecycle**: Real-time status checks across `active`, `inactive`, `cancelled`, and `lapsed` states.

### 2. Score Management System (§ 05)
- **Format**: Stableford points (strictly 1–45).
- **Date Requirement**: Each score includes date played and course name.
- **Rolling 5-Score Retention**: Exactly the latest 5 scores are retained. A new entry automatically prunes the oldest stored score.
- **Strict Single Score Per Date**: Duplicate scores for the same calendar date are rejected with informative error feedback; only edit or delete operations are permitted.
- **Display**: Reverse chronological order (newest score first).

### 3. Draw & Reward Engine (§ 06 & § 07)
- **Cadence**: Monthly live draws.
- **Draw Logic**:
  - `Random`: Standard uniform lottery draw (5 numbers between 1 and 45).
  - `Algorithmic`: Weighted draw proportional to score frequencies within the active subscriber pool.
- **Prize Pool Allocation**:
  - Fixed 40% of all subscription revenue funds the monthly prize pool.
  - **Tier 5 (5-Number Match)**: 40% of pool + Rollover Jackpot. If unclaimed, **100% of this tier rolls over into the next month's jackpot**!
  - **Tier 4 (4-Number Match)**: 35% of pool (split equally among winners; no rollover).
  - **Tier 3 (3-Number Match)**: 25% of pool (split equally among winners; no rollover).
- **Pre-Publish Simulation**: Administrators run live simulations before publishing to preview numbers, matches, and payouts.

### 4. Charity System (§ 08)
- **Contribution Model**: Subscribers select a charity at signup. Minimum contribution is enforced at **10%** of the subscription fee, with voluntary sliders allowing members to increase up to 50%+.
- **Independent Direct Donations**: Visitors and subscribers can donate directly to any charity without entering gameplay.
- **Directory**: Searchable and filterable nonprofit directory with categories, impact totals, and upcoming events (e.g. Charity Golf Invitational Days).
- **Homepage Spotlight**: Highlights top-performing grassroots causes.

### 5. Winner Verification System (§ 09)
- **Eligibility**: Verification workflow applies to winners only.
- **Proof Submission**: Winners upload screenshots of their official golf handicapping/course scorecards.
- **Admin Review**: Administrators inspect proof, add review notes, and **Approve** or **Reject** submissions.
- **Payout Tracking**: Transparent state machine transition: `Pending` → `Approved` → `Paid`.

### 6. User Dashboard (§ 10)
- Subscription status (active/inactive/renewal date, plan switcher).
- Rolling 5-score interactive manager (add, edit, delete with validation guards).
- Charity selection and contribution percentage slider.
- Participation summary (upcoming draw countdown, active ticket numbers).
- Winnings overview with proof submission modal for winning draws.

### 7. Admin Dashboard (§ 11)
Five operational control surfaces:
1. **01 User Management**: View members, inspect scores, toggle subscriptions.
2. **02 Draw Management**: Select algorithm (Random vs Algorithmic), run match simulations, publish live results, and track rollovers.
3. **03 Charity Management**: Add, edit, and delete charities; manage upcoming events.
4. **04 Winners Management**: Inspect proof screenshots, approve/reject, and mark payouts as completed.
5. **05 Reports & Analytics**: Key metrics for subscribers, prize pool, charity funds generated, and draw statistics.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
# App is available at http://localhost:3000

# 3. Run production build
npm run build
npm start

# 4. Run PRD automated rule validation tests
node test-engine.cjs
```

---

## 🌐 Deployment Constraints (§ 15.1)

### Deploy to a new Vercel Account
1. Push this repository to GitHub/GitLab.
2. Log in to [Vercel](https://vercel.com) using a new account.
3. Import the repository and click **Deploy**.

### Connect to a new Supabase Project
1. Create a new project in [Supabase](https://supabase.com).
2. Open the SQL Editor in Supabase and run the provided schema script in [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your Project URL and Anon Key into your Vercel Project Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
