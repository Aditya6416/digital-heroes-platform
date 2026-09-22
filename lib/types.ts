export type UserRole = 'visitor' | 'subscriber' | 'admin';

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'lapsed';

export type DrawMode = 'random' | 'algorithmic';

export type DrawStatus = 'draft' | 'simulated' | 'published';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type PayoutStatus = 'pending' | 'paid';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  handicap?: number;
  homeClub?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  selectedCharityId: string;
  charityPercentage: number; // minimum 10%
  cancelAtPeriodEnd: boolean;
  pricePaid: number;
}

export interface GolfScore {
  id: string;
  userId: string;
  score: number; // 1-45 Stableford
  playedOn: string; // YYYY-MM-DD
  courseName: string;
  createdAt: string;
}

export interface CharityEvent {
  id: string;
  charityId: string;
  title: string;
  location: string;
  eventDate: string;
  description: string;
  registrationLink?: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  category: 'Youth & Education' | 'Military & Veterans' | 'Health & Cancer' | 'Community & Inclusion' | 'Environment';
  tagline: string;
  description: string;
  logoUrl: string;
  heroImageUrl: string;
  website: string;
  totalRaised: number;
  isFeatured: boolean;
  events: CharityEvent[];
}

export interface DrawWinner {
  id: string;
  drawId: string;
  userId: string;
  userName: string;
  userEmail: string;
  matchedCount: 3 | 4 | 5;
  matchedNumbers: number[];
  userScoresSnapshot: number[];
  prizeAmount: number;
  verificationStatus: VerificationStatus;
  payoutStatus: PayoutStatus;
  proofImageUrl?: string;
  proofSubmittedAt?: string;
  adminNotes?: string;
  paidAt?: string;
}

export interface MonthlyDraw {
  id: string;
  monthLabel: string; // e.g. "October 2026"
  scheduledDate: string;
  executedAt?: string;
  mode: DrawMode;
  status: DrawStatus;
  winningNumbers: number[]; // 5 numbers (1-45)
  totalPool: number;
  jackpotRolloverIn: number;
  jackpotRolloverOut: number;
  tier5Share: number; // 40% + rollover
  tier4Share: number; // 35%
  tier3Share: number; // 25%
  winnersCount: {
    tier5: number;
    tier4: number;
    tier3: number;
  };
  winners: DrawWinner[];
}

export interface Donation {
  id: string;
  charityId: string;
  charityName: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}
