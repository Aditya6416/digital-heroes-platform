'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Trophy,
  Heart,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  FileCheck,
  Percent,
  Sliders,
  Sparkles,
  Award,
  ExternalLink,
  Info
} from 'lucide-react';

export default function UserDashboardPage() {
  const {
    currentUser,
    userSubscription,
    userScores,
    charities,
    draws,
    userWinnings,
    activeDraw,
    addGolfScore,
    updateGolfScore,
    deleteGolfScore,
    updateSubscriptionSettings,
    submitWinnerProof,
    quickSwitchRole,
  } = useStore();

  // Score modal state
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [scoreVal, setScoreVal] = useState<number>(36);
  const [playedOnVal, setPlayedOnVal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [courseVal, setCourseVal] = useState<string>('Pebble Beach Golf Links');
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [scoreSuccess, setScoreSuccess] = useState<string | null>(null);

  // Charity edit state
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    userSubscription?.selectedCharityId || (charities[0]?.id || '')
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(
    userSubscription?.charityPercentage || 15
  );
  const [charitySaveSuccess, setCharitySaveSuccess] = useState(false);

  // Winner proof modal state
  const [proofModalWinnerId, setProofModalWinnerId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [proofSubmittedSuccess, setProofSubmittedSuccess] = useState(false);

  // If user is not logged in or is public visitor, display an inviting notice with 1-click login
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-light border border-surface-border flex items-center justify-center mx-auto text-brand-400">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">Subscriber Dashboard</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          Please sign in to access your rolling 5-score Stableford tracker, manage your charity contribution, and view monthly draw results.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => quickSwitchRole('subscriber')}
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold text-sm shadow-lg transition-all"
          >
            Log in as Test Subscriber (Alex Montgomery)
          </button>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-xl bg-surface-light text-slate-200 border border-surface-border text-sm font-semibold hover:bg-surface-elevated transition-colors"
          >
            Custom Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selectedCharityObj = charities.find(c => c.id === (userSubscription?.selectedCharityId || selectedCharityId));
  const totalWon = userWinnings.reduce((acc, w) => acc + w.prizeAmount, 0);

  // Open modal for new score
  const handleOpenAddScore = () => {
    setEditingScoreId(null);
    setScoreVal(36);
    setPlayedOnVal(new Date().toISOString().split('T')[0]);
    setCourseVal('Pebble Beach Golf Links');
    setScoreError(null);
    setScoreSuccess(null);
    setIsScoreModalOpen(true);
  };

  // Open modal for editing score
  const handleOpenEditScore = (scoreItem: any) => {
    setEditingScoreId(scoreItem.id);
    setScoreVal(scoreItem.score);
    setPlayedOnVal(scoreItem.playedOn);
    setCourseVal(scoreItem.courseName);
    setScoreError(null);
    setScoreSuccess(null);
    setIsScoreModalOpen(true);
  };

  // Handle Score Submit
  const handleScoreFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScoreError(null);

    if (scoreVal < 1 || scoreVal > 45) {
      setScoreError('Score must be between 1 and 45 (Stableford format).');
      return;
    }

    if (!playedOnVal) {
      setScoreError('Please choose a valid date.');
      return;
    }

    if (editingScoreId) {
      const res = updateGolfScore(editingScoreId, {
        score: Number(scoreVal),
        playedOn: playedOnVal,
        courseName: courseVal,
      });
      if (!res.success) {
        setScoreError(res.message);
      } else {
        setScoreSuccess('Score updated successfully!');
        setTimeout(() => setIsScoreModalOpen(false), 800);
      }
    } else {
      const res = addGolfScore({
        score: Number(scoreVal),
        playedOn: playedOnVal,
        courseName: courseVal,
      });
      if (!res.success) {
        setScoreError(res.message);
      } else {
        setScoreSuccess(
          userScores.length >= 5
            ? 'Score saved! Oldest score was automatically pruned per 5-score rolling rule.'
            : 'Score saved successfully!'
        );
        setTimeout(() => setIsScoreModalOpen(false), 1200);
      }
    }
  };

  // Handle Charity update
  const handleSaveCharitySettings = () => {
    updateSubscriptionSettings({
      selectedCharityId,
      charityPercentage,
    });
    setCharitySaveSuccess(true);
    setTimeout(() => setCharitySaveSuccess(false), 3000);
  };

  // Handle Winner Proof Submit
  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalWinnerId) return;

    const finalUrl = proofUrl.trim() || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop&q=80';
    submitWinnerProof(proofModalWinnerId, finalUrl);
    setProofSubmittedSuccess(true);
    setTimeout(() => {
      setProofModalWinnerId(null);
      setProofSubmittedSuccess(false);
      setProofUrl('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-semibold">
            Member Control Center · § 10
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Handicap: {currentUser.handicap ?? '18.0'} · Home Club: {currentUser.homeClub ?? 'Pine Valley GC'}
          </p>
        </div>

        {/* Subscription status pill (§ 04 & § 10) */}
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 border-brand-500/20">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400">Subscription Status</p>
              <p className="text-xs font-bold text-white capitalize">
                {userSubscription?.status || 'Active'} · {userSubscription?.plan || 'Monthly'} Plan
              </p>
            </div>
            <span className="text-[11px] text-slate-400 pl-2 border-l border-surface-border">
              Renews: {userSubscription ? formatDate(userSubscription.currentPeriodEnd) : 'Oct 1, 2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Stat Highlights (§ 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active 5 Numbers */}
        <div className="glass-panel p-5 rounded-2xl border-brand-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Draw Numbers</span>
            <Trophy className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {userScores.length > 0 ? (
              userScores.map(s => (
                <span key={s.id} className="w-8 h-8 draw-ball text-xs font-bold">
                  {s.score}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No scores logged yet</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {userScores.length} of 5 scores active for next draw
          </p>
        </div>

        {/* Card 2: Selected Charity & Contribution */}
        <div className="glass-panel p-5 rounded-2xl border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Giving Back</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-base font-bold text-white mt-2 truncate">
            {selectedCharityObj?.name || 'Youth on Course'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-rose-400">
              {userSubscription?.charityPercentage ?? 15}% of subscription
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Min 10% enforced · customizable below
          </p>
        </div>

        {/* Card 3: Total Winnings */}
        <div className="glass-panel p-5 rounded-2xl border-gold-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Winnings Overview</span>
            <Award className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-bold text-gold-400 mt-2">
            {formatCurrency(totalWon)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {userWinnings.length} winning draw{userWinnings.length === 1 ? '' : 's'} recorded
          </p>
        </div>

        {/* Card 4: Upcoming Draw */}
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Next Live Draw</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-white mt-2">
            {activeDraw?.monthLabel || 'October 2026'}
          </p>
          <p className="text-xs font-semibold text-indigo-300 mt-0.5">
            Pool: {formatCurrency(activeDraw?.totalPool || 62000)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Draw Date: {activeDraw ? formatDate(activeDraw.scheduledDate) : 'Oct 31, 2026'}
          </p>
        </div>
      </div>

      {/* Winner Verification Banner / Notice (§ 09 Winner Verification System) */}
      {userWinnings.some(w => w.verificationStatus === 'pending') && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-gold-500/10 to-transparent border border-amber-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Action Required: You have an unclaimed Draw Winner Payout!
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                    Verification Needed
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Under PRD § 09, winners must submit score proof (e.g. screenshot from official handicapping / golf app) to complete verification and receive payout funds.
                </p>
              </div>
            </div>

            {userWinnings.filter(w => w.verificationStatus === 'pending').map(pendingWinner => (
              <button
                key={pendingWinner.id}
                onClick={() => {
                  setProofModalWinnerId(pendingWinner.id);
                  setProofUrl(pendingWinner.proofImageUrl || '');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Score Proof ({formatCurrency(pendingWinner.prizeAmount)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 1: Rolling 5-Score Management System (§ 05) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-brand-400 font-semibold">
                § 05 Specification
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-mono">
                Stableford (1–45)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Rolling 5-Score Management
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Only the latest 5 scores are retained. A new entry automatically replaces the oldest stored score. Duplicate dates are prohibited.
            </p>
          </div>

          <button
            onClick={handleOpenAddScore}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Enter New Golf Score
          </button>
        </div>

        {/* Explanatory Callout (§ 05 Note) */}
        <div className="p-3.5 rounded-xl bg-surface-light/80 border border-surface-border text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Rule Enforced: </span>
            Only one score entry is permitted per date. Duplicate scores for the same date are rejected. The 5 scores below represent your active ticket entries for the upcoming monthly draw.
          </div>
        </div>

        {/* Scores Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Stableford Score (1–45)</th>
                <th className="pb-3 font-semibold">Date Played</th>
                <th className="pb-3 font-semibold">Course Name</th>
                <th className="pb-3 font-semibold">Draw Ticket Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {userScores.map((scoreItem, index) => (
                <tr key={scoreItem.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3 font-mono text-slate-400">
                    #{index + 1} {index === 0 && <span className="text-[10px] text-brand-400 font-bold ml-1">(Latest)</span>}
                    {index === 4 && <span className="text-[10px] text-amber-400 font-bold ml-1">(Oldest - Next to prune)</span>}
                  </td>
                  <td className="py-3 font-bold">
                    <span className="w-8 h-8 draw-ball text-xs">
                      {scoreItem.score}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-300">
                    {formatDate(scoreItem.playedOn)}
                  </td>
                  <td className="py-3 text-slate-300 font-medium">
                    {scoreItem.courseName}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Active in Draw
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditScore(scoreItem)}
                      className="p-1.5 rounded-lg bg-surface-light hover:bg-surface-elevated text-slate-300 hover:text-white transition-colors"
                      title="Edit score or course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGolfScore(scoreItem.id)}
                      className="p-1.5 rounded-lg bg-surface-light hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete score"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {userScores.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No scores entered yet. Enter your first Stableford score to participate in the draw!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Charity Giving & Contribution Config (§ 08) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="pb-4 border-b border-surface-border">
          <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-semibold">
            § 08 Charity System
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Charity Selection & Contribution Percentage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Minimum contribution is 10% of your subscription fee. You may voluntarily increase your percentage at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Designated Charity Recipient
              </label>
              <select
                value={selectedCharityId}
                onChange={e => setSelectedCharityId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white text-xs focus:outline-none focus:border-brand-500"
              >
                {charities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Your Contribution Percentage
                </label>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  {charityPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={charityPercentage}
                onChange={e => setCharityPercentage(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-surface-light rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>10% (Minimum)</span>
                <span>25%</span>
                <span>50% (Max Hero Impact)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSaveCharitySettings}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md transition-all"
              >
                Save Giving Settings
              </button>
              {charitySaveSuccess && (
                <span className="text-xs text-brand-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved!
                </span>
              )}
            </div>
          </div>

          {/* Charity Snapshot preview card */}
          {selectedCharityObj && (
            <div className="p-5 rounded-2xl bg-surface-light border border-surface-border space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedCharityObj.logoUrl}
                  alt={selectedCharityObj.name}
                  className="w-12 h-12 rounded-xl object-cover border border-surface-border"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedCharityObj.name}</h4>
                  <span className="text-[11px] text-brand-400">{selectedCharityObj.category}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedCharityObj.tagline}
              </p>
              <div className="pt-2 border-t border-surface-border/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Platform Impact:</span>
                <span className="font-bold text-brand-400 font-mono">
                  {formatCurrency(selectedCharityObj.totalRaised)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Winnings & Winner Proof Verification System (§ 09 & § 10) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="pb-4 border-b border-surface-border">
          <span className="text-xs uppercase font-mono tracking-wider text-gold-400 font-semibold">
            § 09 & § 10 Winnings & Verification
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Draw Participation & Winnings History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All prize wins are subject to score proof verification. Upload your official golf app scorecards for admin sign-off.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Draw Period</th>
                <th className="pb-3 font-semibold">Match Type</th>
                <th className="pb-3 font-semibold">Matched Numbers</th>
                <th className="pb-3 font-semibold">Prize Amount</th>
                <th className="pb-3 font-semibold">Verification Status</th>
                <th className="pb-3 font-semibold">Payout Status</th>
                <th className="pb-3 font-semibold text-right">Proof Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {userWinnings.map(win => (
                <tr key={win.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3 font-bold text-white">
                    {draws.find(d => d.id === win.drawId)?.monthLabel || win.drawId}
                  </td>
                  <td className="py-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-surface border border-surface-border font-bold text-gold-300">
                      {win.matchedCount}-Number Match
                    </span>
                  </td>
                  <td className="py-3 font-mono">
                    <div className="flex items-center gap-1">
                      {win.matchedNumbers.map(n => (
                        <span key={n} className="w-5 h-5 draw-ball-gold text-[10px]">
                          {n}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-white text-sm">
                    {formatCurrency(win.prizeAmount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                        win.verificationStatus === 'approved'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : win.verificationStatus === 'rejected'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {win.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                        win.payoutStatus === 'paid'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {win.payoutStatus === 'paid' ? 'Paid to Bank' : 'Pending Verification'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {win.proofImageUrl ? (
                      <span className="text-xs text-brand-400 font-medium inline-flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setProofModalWinnerId(win.id);
                          setProofUrl('');
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
                      >
                        Upload Proof
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {userWinnings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No winnings in past draws yet. Keep your 5 Stableford scores up to date for the upcoming draw!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Score Entry & Edit (§ 05) */}
      {isScoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-surface p-6 sm:p-8 rounded-3xl max-w-md w-full border-surface-border shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingScoreId ? 'Edit Golf Score' : 'Log Stableford Score'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces 1–45 range and single-entry per date.
                </p>
              </div>
              <button
                onClick={() => setIsScoreModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {scoreError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{scoreError}</span>
              </div>
            )}

            {scoreSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{scoreSuccess}</span>
              </div>
            )}

            <form onSubmit={handleScoreFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Stableford Score (1 to 45)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    value={scoreVal}
                    onChange={e => setScoreVal(Number(e.target.value))}
                    className="w-24 px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white text-base font-mono font-bold focus:outline-none focus:border-brand-500"
                  />
                  <span className="text-xs text-slate-400">
                    Points accumulated during your 18 holes
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date Played (Single Entry Per Date Rule)
                </label>
                <input
                  type="date"
                  required
                  value={playedOnVal}
                  onChange={e => setPlayedOnVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Course Name / Club
                </label>
                <input
                  type="text"
                  required
                  value={courseVal}
                  onChange={e => setCourseVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white text-xs focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Cypress Point Club"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsScoreModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-light hover:bg-surface-elevated text-slate-300 text-xs font-semibold border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
                >
                  {editingScoreId ? 'Update Score' : 'Save Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Winner Proof Upload (§ 09) */}
      {proofModalWinnerId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-surface p-6 sm:p-8 rounded-3xl max-w-md w-full border-surface-border shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Upload Official Score Proof
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  PRD § 09 Winner Verification: Submit a screenshot from your golf platform.
                </p>
              </div>
              <button
                onClick={() => setProofModalWinnerId(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {proofSubmittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Proof submitted successfully! Admin will review for payout release.</span>
              </div>
            ) : (
              <form onSubmit={handleProofSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Screenshot Image URL
                  </label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={e => setProofUrl(e.target.value)}
                    placeholder="https://... (leave blank to use sample verified scorecard)"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Accepts PNG/JPG/PDF link or leave blank to attach verified mock scorecard.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-light border border-surface-border text-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-brand-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Score Verification Guarantee</p>
                  <p className="text-[11px] text-slate-400">
                    Our compliance team checks Stableford dates and course handicap stamps within 24 hours.
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProofModalWinnerId(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-surface-light hover:bg-surface-elevated text-slate-300 text-xs font-semibold border border-surface-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface text-xs font-bold shadow-md shadow-amber-500/20"
                  >
                    Submit Proof
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
