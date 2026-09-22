'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Subscription,
  GolfScore,
  Charity,
  MonthlyDraw,
  DrawWinner,
  Donation,
  DrawMode,
  VerificationStatus,
  PayoutStatus,
} from './types';
import {
  INITIAL_CHARITIES,
  INITIAL_USERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SCORES,
  INITIAL_DRAWS,
} from './mock-data';
import { executeDrawCalculation, SimulationResult } from './draw-engine';

interface StoreContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  subscriptions: Record<string, Subscription>;
  userSubscription: Subscription | null;
  scores: GolfScore[];
  userScores: GolfScore[];
  charities: Charity[];
  draws: MonthlyDraw[];
  donations: Donation[];
  userWinnings: DrawWinner[];
  activeDraw: MonthlyDraw | null;
  lastSimulation: SimulationResult | null;
  // Auth actions
  login: (email: string, role?: 'subscriber' | 'admin') => boolean;
  logout: () => void;
  quickSwitchRole: (role: 'subscriber' | 'admin' | 'visitor') => void;
  // Score management (§ 05)
  addGolfScore: (data: { score: number; playedOn: string; courseName?: string }) => { success: boolean; message: string };
  updateGolfScore: (id: string, data: { score: number; playedOn: string; courseName?: string }) => { success: boolean; message: string };
  deleteGolfScore: (id: string) => void;
  // Subscription management (§ 04)
  updateSubscriptionSettings: (settings: {
    plan?: 'monthly' | 'yearly';
    selectedCharityId?: string;
    charityPercentage?: number;
    status?: 'active' | 'inactive' | 'cancelled' | 'lapsed';
  }) => void;
  // Draw operations (§ 06 & § 07)
  runSimulation: (mode: DrawMode, customNumbers?: number[]) => SimulationResult;
  publishDraw: (drawId: string, result: SimulationResult) => void;
  // Winner verification (§ 09)
  submitWinnerProof: (winnerId: string, proofImageUrl: string) => void;
  adminReviewProof: (winnerId: string, status: VerificationStatus, notes?: string) => void;
  adminMarkPayout: (winnerId: string) => void;
  // Charity operations (§ 08)
  addCharity: (charity: Omit<Charity, 'id' | 'totalRaised' | 'events'>) => void;
  updateCharity: (id: string, updates: Partial<Charity>) => void;
  deleteCharity: (id: string) => void;
  addDonation: (data: { charityId: string; donorName: string; donorEmail: string; amount: number; message?: string; isAnonymous?: boolean }) => void;
  // Admin user management
  adminUpdateUser: (userId: string, updates: Partial<UserProfile>) => void;
  adminUpdateUserSubscription: (userId: string, status: 'active' | 'inactive' | 'cancelled' | 'lapsed') => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'digital_heroes_app_state_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]); // Alex (subscriber)
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>(INITIAL_SUBSCRIPTIONS);
  const [scores, setScores] = useState<GolfScore[]>(INITIAL_SCORES);
  const [charities, setCharities] = useState<Charity[]>(INITIAL_CHARITIES);
  const [draws, setDraws] = useState<MonthlyDraw[]>(INITIAL_DRAWS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [lastSimulation, setLastSimulation] = useState<SimulationResult | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.charities) setCharities(parsed.charities);
        if (parsed.draws) setDraws(parsed.draws);
        if (parsed.donations) setDonations(parsed.donations);
        if (parsed.currentUserId) {
          const user = (parsed.users || INITIAL_USERS).find((u: UserProfile) => u.id === parsed.currentUserId);
          if (user) setCurrentUser(user);
        }
      }
    } catch (err) {
      console.warn('Failed to load stored state:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        currentUserId: currentUser?.id,
        users,
        subscriptions,
        scores,
        charities,
        draws,
        donations,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save state:', err);
    }
  }, [isHydrated, currentUser, users, subscriptions, scores, charities, draws, donations]);

  const userSubscription = currentUser ? subscriptions[currentUser.id] || null : null;

  // Filter scores for current user, sorted reverse chronologically (most recent first)
  const userScores = currentUser
    ? scores
        .filter(s => s.userId === currentUser.id)
        .sort((a, b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime())
        .slice(0, 5) // Enforce exactly latest 5
    : [];

  // Active upcoming draw
  const activeDraw = draws.find(d => d.status === 'draft') || draws[draws.length - 1];

  // User's all winnings
  const userWinnings: DrawWinner[] = [];
  if (currentUser) {
    draws.forEach(draw => {
      draw.winners.forEach(winner => {
        if (winner.userId === currentUser.id) {
          userWinnings.push(winner);
        }
      });
    });
  }

  // --- Auth & Role Switching ---
  const login = (email: string, role: 'subscriber' | 'admin' = 'subscriber'): boolean => {
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      // create new user
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role,
        createdAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
      found = newUser;

      if (role === 'subscriber') {
        const newSub: Subscription = {
          id: `sub-${Date.now()}`,
          userId: newUser.id,
          plan: 'monthly',
          status: 'active',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          selectedCharityId: charities[0]?.id || '',
          charityPercentage: 15,
          cancelAtPeriodEnd: false,
          pricePaid: 19,
        };
        setSubscriptions(prev => ({ ...prev, [newUser.id]: newSub }));
      }
    }
    setCurrentUser(found);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickSwitchRole = (role: 'subscriber' | 'admin' | 'visitor') => {
    if (role === 'visitor') {
      setCurrentUser(null);
    } else if (role === 'admin') {
      const admin = users.find(u => u.role === 'admin') || INITIAL_USERS[1];
      setCurrentUser(admin);
    } else {
      const subscriber = users.find(u => u.role === 'subscriber') || INITIAL_USERS[0];
      setCurrentUser(subscriber);
    }
  };

  // --- Score Management (§ 05) ---
  const addGolfScore = ({
    score,
    playedOn,
    courseName = 'Local Golf Course',
  }: {
    score: number;
    playedOn: string;
    courseName?: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'You must be logged in to enter scores.' };

    if (score < 1 || score > 45) {
      return { success: false, message: 'Score must be between 1 and 45 in Stableford format.' };
    }

    if (!playedOn) {
      return { success: false, message: 'A valid date is required for the score entry.' };
    }

    // Strict Rule (§ 05): Only one score entry is permitted per date. Duplicate scores for the same date are not allowed.
    const existingSameDate = scores.find(s => s.userId === currentUser.id && s.playedOn === playedOn);
    if (existingSameDate) {
      return {
        success: false,
        message: `Only one score entry is permitted per date (${playedOn}). An existing entry for this date already exists. You may edit or delete it instead.`,
      };
    }

    const newEntry: GolfScore = {
      id: `score-${Date.now()}`,
      userId: currentUser.id,
      score,
      playedOn,
      courseName,
      createdAt: new Date().toISOString(),
    };

    // Auto-pruning (§ 05): Retain only latest 5 scores. A new score replaces the oldest stored score automatically.
    setScores(prev => {
      const userList = [...prev.filter(s => s.userId === currentUser.id), newEntry];
      // Sort reverse chronological
      userList.sort((a, b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime());
      const kept = userList.slice(0, 5);
      const others = prev.filter(s => s.userId !== currentUser.id);
      return [...others, ...kept];
    });

    return { success: true, message: 'Golf score saved successfully!' };
  };

  const updateGolfScore = (
    id: string,
    data: { score: number; playedOn: string; courseName?: string }
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Must be logged in' };
    if (data.score < 1 || data.score > 45) {
      return { success: false, message: 'Score must be between 1 and 45.' };
    }

    // Check duplicate date for other scores
    const duplicate = scores.find(
      s => s.userId === currentUser.id && s.id !== id && s.playedOn === data.playedOn
    );
    if (duplicate) {
      return { success: false, message: `Another score already exists for date ${data.playedOn}.` };
    }

    setScores(prev =>
      prev.map(s => (s.id === id ? { ...s, ...data, courseName: data.courseName || s.courseName } : s))
    );

    return { success: true, message: 'Score updated successfully.' };
  };

  const deleteGolfScore = (id: string) => {
    setScores(prev => prev.filter(s => s.id !== id));
  };

  // --- Subscription Management (§ 04) ---
  const updateSubscriptionSettings = (settings: {
    plan?: 'monthly' | 'yearly';
    selectedCharityId?: string;
    charityPercentage?: number;
    status?: 'active' | 'inactive' | 'cancelled' | 'lapsed';
  }) => {
    if (!currentUser) return;
    setSubscriptions(prev => {
      const existing = prev[currentUser.id] || {
        id: `sub-${Date.now()}`,
        userId: currentUser.id,
        plan: 'monthly',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        selectedCharityId: charities[0]?.id || '',
        charityPercentage: 15,
        cancelAtPeriodEnd: false,
        pricePaid: 19,
      };

      const updated = {
        ...existing,
        ...settings,
        charityPercentage:
          settings.charityPercentage !== undefined
            ? Math.max(10, settings.charityPercentage) // Enforce min 10%
            : existing.charityPercentage,
      };

      return { ...prev, [currentUser.id]: updated };
    });
  };

  // --- Draw Operations (§ 06 & § 07) ---
  const runSimulation = (mode: DrawMode, customNumbers?: number[]): SimulationResult => {
    const activeSubscribers = users.filter(u => subscriptions[u.id]?.status === 'active');
    const userScoresMap = new Map<string, number[]>();

    activeSubscribers.forEach(sub => {
      const userSc = scores
        .filter(s => s.userId === sub.id)
        .sort((a, b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime())
        .slice(0, 5)
        .map(s => s.score);
      userScoresMap.set(sub.id, userSc);
    });

    const previousDraw = draws.find(d => d.status === 'published');
    const rolloverIn = previousDraw ? previousDraw.jackpotRolloverOut : 0;

    const sim = executeDrawCalculation({
      drawId: activeDraw?.id || 'sim-draw',
      mode,
      presetNumbers: customNumbers,
      activeSubscribers,
      userScoresMap,
      jackpotRolloverIn: rolloverIn,
    });

    setLastSimulation(sim);
    return sim;
  };

  const publishDraw = (drawId: string, result: SimulationResult) => {
    setDraws(prev =>
      prev.map(draw => {
        if (draw.id !== drawId) return draw;
        return {
          ...draw,
          executedAt: new Date().toISOString(),
          status: 'published',
          mode: result.mode,
          winningNumbers: result.winningNumbers,
          totalPool: result.totalPool,
          jackpotRolloverIn: result.jackpotRolloverIn,
          jackpotRolloverOut: result.jackpotRolloverOut,
          tier5Share: result.tier5Share,
          tier4Share: result.tier4Share,
          tier3Share: result.tier3Share,
          winnersCount: {
            tier5: result.tier5Winners.length,
            tier4: result.tier4Winners.length,
            tier3: result.tier3Winners.length,
          },
          winners: result.allWinners,
        };
      })
    );

    // Update charity contributions based on draw
    setCharities(prev =>
      prev.map(c => {
        // Add active subscriber share
        const supporters = Object.values(subscriptions).filter(s => s.selectedCharityId === c.id && s.status === 'active');
        const contribution = supporters.reduce((acc, sub) => acc + (sub.pricePaid * (sub.charityPercentage / 100)), 0);
        return { ...c, totalRaised: c.totalRaised + Math.round(contribution) };
      })
    );
  };

  // --- Winner Verification (§ 09) ---
  const submitWinnerProof = (winnerId: string, proofImageUrl: string) => {
    setDraws(prev =>
      prev.map(d => ({
        ...d,
        winners: d.winners.map(w => {
          if (w.id !== winnerId) return w;
          return {
            ...w,
            proofImageUrl,
            proofSubmittedAt: new Date().toISOString(),
            verificationStatus: 'pending' as VerificationStatus,
          };
        }),
      }))
    );
  };

  const adminReviewProof = (winnerId: string, status: VerificationStatus, notes?: string) => {
    setDraws(prev =>
      prev.map(d => ({
        ...d,
        winners: d.winners.map(w => {
          if (w.id !== winnerId) return w;
          return {
            ...w,
            verificationStatus: status,
            adminNotes: notes || w.adminNotes,
          };
        }),
      }))
    );
  };

  const adminMarkPayout = (winnerId: string) => {
    setDraws(prev =>
      prev.map(d => ({
        ...d,
        winners: d.winners.map(w => {
          if (w.id !== winnerId) return w;
          return {
            ...w,
            payoutStatus: 'paid' as PayoutStatus,
            paidAt: new Date().toISOString(),
          };
        }),
      }))
    );
  };

  // --- Charity Operations (§ 08) ---
  const addCharity = (charity: Omit<Charity, 'id' | 'totalRaised' | 'events'>) => {
    const newCharity: Charity = {
      ...charity,
      id: `charity-${Date.now()}`,
      totalRaised: 0,
      events: [],
    };
    setCharities(prev => [newCharity, ...prev]);
  };

  const updateCharity = (id: string, updates: Partial<Charity>) => {
    setCharities(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCharity = (id: string) => {
    setCharities(prev => prev.filter(c => c.id !== id));
  };

  const addDonation = (data: {
    charityId: string;
    donorName: string;
    donorEmail: string;
    amount: number;
    message?: string;
    isAnonymous?: boolean;
  }) => {
    const charity = charities.find(c => c.id === data.charityId);
    const donation: Donation = {
      id: `don-${Date.now()}`,
      charityId: data.charityId,
      charityName: charity ? charity.name : 'Unknown Charity',
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      amount: data.amount,
      message: data.message,
      isAnonymous: !!data.isAnonymous,
      createdAt: new Date().toISOString(),
    };
    setDonations(prev => [donation, ...prev]);

    // Add to charity total
    setCharities(prev =>
      prev.map(c => (c.id === data.charityId ? { ...c, totalRaised: c.totalRaised + data.amount } : c))
    );
  };

  // --- Admin User Management (§ 11) ---
  const adminUpdateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const adminUpdateUserSubscription = (
    userId: string,
    status: 'active' | 'inactive' | 'cancelled' | 'lapsed'
  ) => {
    setSubscriptions(prev => {
      const existing = prev[userId];
      if (!existing) return prev;
      return {
        ...prev,
        [userId]: { ...existing, status },
      };
    });
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        users,
        subscriptions,
        userSubscription,
        scores,
        userScores,
        charities,
        draws,
        donations,
        userWinnings,
        activeDraw,
        lastSimulation,
        login,
        logout,
        quickSwitchRole,
        addGolfScore,
        updateGolfScore,
        deleteGolfScore,
        updateSubscriptionSettings,
        runSimulation,
        publishDraw,
        submitWinnerProof,
        adminReviewProof,
        adminMarkPayout,
        addCharity,
        updateCharity,
        deleteCharity,
        addDonation,
        adminUpdateUser,
        adminUpdateUserSubscription,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
