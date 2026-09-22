import { GolfScore, DrawMode, DrawWinner, MonthlyDraw, UserProfile } from './types';

/**
 * Generate 5 distinct numbers between 1 and 45
 */
export function generateDrawNumbers(mode: DrawMode, allScores: GolfScore[] = []): number[] {
  if (mode === 'random' || allScores.length === 0) {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  // Algorithmic: Weighted by score frequency among active users
  const frequencyMap = new Map<number, number>();
  for (let i = 1; i <= 45; i++) {
    frequencyMap.set(i, 1); // baseline laplace smoothing
  }

  allScores.forEach(s => {
    if (s.score >= 1 && s.score <= 45) {
      frequencyMap.set(s.score, (frequencyMap.get(s.score) || 1) + 5);
    }
  });

  const selected = new Set<number>();
  while (selected.size < 5) {
    let totalWeight = 0;
    frequencyMap.forEach((weight, num) => {
      if (!selected.has(num)) totalWeight += weight;
    });

    let randomVal = Math.random() * totalWeight;
    const entries = Array.from(frequencyMap.entries());
    for (const [num, weight] of entries) {
      if (selected.has(num)) continue;
      randomVal -= weight;
      if (randomVal <= 0) {
        selected.add(num);
        break;
      }
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}

/**
 * Calculate match between user's current 5 scores and winning numbers
 */
export function calculateMatches(userScores: number[], winningNumbers: number[]): {
  matchedCount: 3 | 4 | 5 | 0;
  matchedNumbers: number[];
} {
  const userSet = new Set(userScores);
  const winSet = new Set(winningNumbers);
  const matched = Array.from(userSet).filter(num => winSet.has(num)).sort((a, b) => a - b);

  if (matched.length >= 5) return { matchedCount: 5, matchedNumbers: matched.slice(0, 5) };
  if (matched.length === 4) return { matchedCount: 4, matchedNumbers: matched };
  if (matched.length === 3) return { matchedCount: 3, matchedNumbers: matched };
  return { matchedCount: 0, matchedNumbers: [] };
}

export interface SimulationResult {
  winningNumbers: number[];
  mode: DrawMode;
  totalPool: number;
  jackpotRolloverIn: number;
  jackpotRolloverOut: number;
  tier5Share: number;
  tier4Share: number;
  tier3Share: number;
  tier5Winners: DrawWinner[];
  tier4Winners: DrawWinner[];
  tier3Winners: DrawWinner[];
  allWinners: DrawWinner[];
}

/**
 * Simulate or execute draw against active subscribers
 */
export function executeDrawCalculation({
  drawId,
  mode,
  presetNumbers,
  activeSubscribers,
  userScoresMap,
  jackpotRolloverIn = 0,
  baseMonthlySubscriptionFee = 19,
}: {
  drawId: string;
  mode: DrawMode;
  presetNumbers?: number[];
  activeSubscribers: UserProfile[];
  userScoresMap: Map<string, number[]>; // userId -> array of scores (up to 5)
  jackpotRolloverIn?: number;
  baseMonthlySubscriptionFee?: number;
}): SimulationResult {
  // Collect all active scores for algorithmic weighting
  const flatScores: GolfScore[] = [];
  userScoresMap.forEach((scores, uid) => {
    scores.forEach(score => {
      flatScores.push({ id: '', userId: uid, score, playedOn: '', courseName: '', createdAt: '' });
    });
  });

  const winningNumbers = presetNumbers && presetNumbers.length === 5 
    ? [...presetNumbers].sort((a, b) => a - b)
    : generateDrawNumbers(mode, flatScores);

  // Pool calculation (§ 07): 40% of subscription revenue contributes to prize pool
  const subscriberCount = Math.max(activeSubscribers.length, 1);
  const newPoolShare = subscriberCount * baseMonthlySubscriptionFee * 0.40;
  
  // Total tier portions
  const tier5Base = newPoolShare * 0.40;
  const tier4Share = Math.round(newPoolShare * 0.35);
  const tier3Share = Math.round(newPoolShare * 0.25);
  const tier5Share = Math.round(tier5Base + jackpotRolloverIn);
  const totalPool = tier5Share + tier4Share + tier3Share;

  const tier5Eligible: Array<{ user: UserProfile; matched: number[]; scores: number[] }> = [];
  const tier4Eligible: Array<{ user: UserProfile; matched: number[]; scores: number[] }> = [];
  const tier3Eligible: Array<{ user: UserProfile; matched: number[]; scores: number[] }> = [];

  for (const user of activeSubscribers) {
    const scores = userScoresMap.get(user.id) || [];
    if (scores.length === 0) continue;

    const { matchedCount, matchedNumbers } = calculateMatches(scores, winningNumbers);
    if (matchedCount === 5) {
      tier5Eligible.push({ user, matched: matchedNumbers, scores });
    } else if (matchedCount === 4) {
      tier4Eligible.push({ user, matched: matchedNumbers, scores });
    } else if (matchedCount === 3) {
      tier3Eligible.push({ user, matched: matchedNumbers, scores });
    }
  }

  // Calculate prizes split equally
  const tier5Winners: DrawWinner[] = tier5Eligible.map(e => ({
    id: `w5-${e.user.id}-${Date.now()}`,
    drawId,
    userId: e.user.id,
    userName: e.user.fullName,
    userEmail: e.user.email,
    matchedCount: 5,
    matchedNumbers: e.matched,
    userScoresSnapshot: e.scores,
    prizeAmount: Math.round(tier5Share / tier5Eligible.length),
    verificationStatus: 'pending',
    payoutStatus: 'pending',
  }));

  const tier4Winners: DrawWinner[] = tier4Eligible.map(e => ({
    id: `w4-${e.user.id}-${Date.now()}`,
    drawId,
    userId: e.user.id,
    userName: e.user.fullName,
    userEmail: e.user.email,
    matchedCount: 4,
    matchedNumbers: e.matched,
    prizeAmount: Math.round(tier4Share / tier4Eligible.length),
    userScoresSnapshot: e.scores,
    verificationStatus: 'pending',
    payoutStatus: 'pending',
  }));

  const tier3Winners: DrawWinner[] = tier3Eligible.map(e => ({
    id: `w3-${e.user.id}-${Date.now()}`,
    drawId,
    userId: e.user.id,
    userName: e.user.fullName,
    userEmail: e.user.email,
    matchedCount: 3,
    matchedNumbers: e.matched,
    prizeAmount: Math.round(tier3Share / tier3Eligible.length),
    userScoresSnapshot: e.scores,
    verificationStatus: 'pending',
    payoutStatus: 'pending',
  }));

  // Rollover logic (§ 07): 5-match jackpot carries forward if unclaimed
  const jackpotRolloverOut = tier5Winners.length === 0 ? tier5Share : 0;

  return {
    winningNumbers,
    mode,
    totalPool,
    jackpotRolloverIn,
    jackpotRolloverOut,
    tier5Share,
    tier4Share,
    tier3Share,
    tier5Winners,
    tier4Winners,
    tier3Winners,
    allWinners: [...tier5Winners, ...tier4Winners, ...tier3Winners],
  };
}
