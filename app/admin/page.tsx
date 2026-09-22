'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DrawMode, VerificationStatus, Charity } from '@/lib/types';
import {
  ShieldCheck,
  Users,
  Trophy,
  Heart,
  Award,
  BarChart3,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    currentUser,
    users,
    subscriptions,
    scores,
    charities,
    draws,
    activeDraw,
    lastSimulation,
    runSimulation,
    publishDraw,
    adminReviewProof,
    adminMarkPayout,
    addCharity,
    updateCharity,
    deleteCharity,
    adminUpdateUser,
    adminUpdateUserSubscription,
    quickSwitchRole,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'users' | 'draws' | 'charities' | 'winners' | 'analytics'>('draws');

  // Draw Management State
  const [selectedDrawMode, setSelectedDrawMode] = useState<DrawMode>('algorithmic');
  const [customNumbersInput, setCustomNumbersInput] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Charity modal state
  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);
  const [editingCharityId, setEditingCharityId] = useState<string | null>(null);
  const [charityName, setCharityName] = useState('');
  const [charityCategory, setCharityCategory] = useState<any>('Youth & Education');
  const [charityTagline, setCharityTagline] = useState('');
  const [charityDescription, setCharityDescription] = useState('');
  const [charityLogo, setCharityLogo] = useState('');
  const [charityHero, setCharityHero] = useState('');
  const [charityWebsite, setCharityWebsite] = useState('');

  // Proof inspection modal
  const [inspectingWinner, setInspectingWinner] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // If user is not admin, show barrier with 1-click switcher
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">Administrator Access Required</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          PRD § 11 Admin Dashboard requires administrative privileges. You can instantly switch to the pre-seeded admin persona below.
        </p>
        <div>
          <button
            onClick={() => quickSwitchRole('admin')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            Switch to Admin Persona (Elena Vance)
          </button>
        </div>
      </div>
    );
  }

  // Analytics metrics
  const totalSubscribers = users.filter(u => subscriptions[u.id]?.status === 'active').length;
  const totalRaised = charities.reduce((sum, c) => sum + c.totalRaised, 0);
  const totalPaidOut = draws.reduce((sum, d) => {
    return sum + d.winners.filter(w => w.payoutStatus === 'paid').reduce((p, w) => p + w.prizeAmount, 0);
  }, 0);

  // All winners aggregated across draws
  const allWinners = draws.flatMap(d => d.winners);

  // Handle Simulation
  const handleExecuteSimulation = () => {
    setIsSimulating(true);
    let parsedCustom: number[] | undefined;
    if (customNumbersInput.trim()) {
      parsedCustom = customNumbersInput
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n >= 1 && n <= 45);
      if (parsedCustom.length !== 5) {
        alert('Please enter exactly 5 valid numbers between 1 and 45 (comma separated).');
        setIsSimulating(false);
        return;
      }
    }

    setTimeout(() => {
      runSimulation(selectedDrawMode, parsedCustom);
      setIsSimulating(false);
    }, 400);
  };

  // Handle Publish Draw
  const handlePublishDraw = () => {
    if (!lastSimulation || !activeDraw) return;
    publishDraw(activeDraw.id, lastSimulation);
    setPublishSuccessMsg(`Draw successfully published for ${activeDraw.monthLabel}!`);
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  // Charity Save
  const handleSaveCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCharityId) {
      updateCharity(editingCharityId, {
        name: charityName,
        category: charityCategory,
        tagline: charityTagline,
        description: charityDescription,
        logoUrl: charityLogo,
        heroImageUrl: charityHero,
        website: charityWebsite,
      });
    } else {
      addCharity({
        name: charityName,
        slug: charityName.toLowerCase().replace(/\s+/g, '-'),
        category: charityCategory,
        tagline: charityTagline,
        description: charityDescription,
        logoUrl: charityLogo || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=160',
        heroImageUrl: charityHero || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200',
        website: charityWebsite || 'https://example.org',
        isFeatured: false,
      });
    }
    setIsCharityModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Platform Administration · § 11
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Digital Heroes Control Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational command center: User profiles, Draw execution engine, Charity listings, Winner verification, and Analytics.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-surface-light border border-surface-border rounded-xl">
          <button
            onClick={() => setActiveTab('draws')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'draws'
                ? 'bg-amber-400 text-surface shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            02 Draws Engine
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'winners'
                ? 'bg-amber-400 text-surface shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            04 Winners Verification
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'users'
                ? 'bg-amber-400 text-surface shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            01 Users & Scores
          </button>
          <button
            onClick={() => setActiveTab('charities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'charities'
                ? 'bg-amber-400 text-surface shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            03 Charities
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-400 text-surface shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            05 Analytics
          </button>
        </div>
      </div>

      {/* 02 DRAW MANAGEMENT TAB (§ 06, § 07, § 11.02) */}
      {activeTab === 'draws' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Draw Config Card */}
            <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-1 border-amber-500/30">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Configuration
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Configure Draw Mode</h3>
                <p className="text-xs text-slate-400 mt-1">
                  PRD § 06: Choose standard lottery or frequency-weighted algorithm.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Draw Algorithm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedDrawMode('algorithmic')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedDrawMode === 'algorithmic'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-surface-light border-surface-border text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold">Algorithmic</p>
                    <p className="text-[10px] mt-1 text-slate-400">
                      Weighted by score frequency among active members
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedDrawMode('random')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedDrawMode === 'random'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-surface-light border-surface-border text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold">Random</p>
                    <p className="text-[10px] mt-1 text-slate-400">
                      Standard uniform lottery distribution (1–45)
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Override Winning Numbers (Optional testing)
                </label>
                <input
                  type="text"
                  value={customNumbersInput}
                  onChange={e => setCustomNumbersInput(e.target.value)}
                  placeholder="e.g. 29, 34, 36, 38, 41"
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave blank to auto-generate based on selected mode.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExecuteSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isSimulating ? 'Simulating Matches...' : 'Run Draw Simulation'}
                </button>
              </div>
            </div>

            {/* Simulation Preview & Publishing Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 lg:col-span-2 border-surface-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-400 font-bold">
                    Pre-Publish Simulation Chamber
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {activeDraw?.monthLabel || 'Upcoming Draw'} Simulation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Preview payouts, winner distribution, and rollover jackpot before publishing live.
                  </p>
                </div>

                {lastSimulation && (
                  <button
                    onClick={handlePublishDraw}
                    className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Live Results
                  </button>
                )}
              </div>

              {publishSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              {lastSimulation ? (
                <div className="space-y-6">
                  {/* Winning Balls Drawn */}
                  <div className="p-5 rounded-2xl bg-surface-light border border-surface-border">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block mb-2">
                      Simulated Winning Numbers ({lastSimulation.mode} mode)
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {lastSimulation.winningNumbers.map(num => (
                        <span key={num} className="w-10 h-10 draw-ball-gold text-base">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tier breakdown grid (§ 07) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-surface border border-surface-border">
                      <p className="font-semibold text-slate-300">5-Number Match (40%)</p>
                      <p className="text-lg font-bold text-gold-400 mt-1">
                        {formatCurrency(lastSimulation.tier5Share)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Winners: {lastSimulation.tier5Winners.length}
                      </p>
                      {lastSimulation.jackpotRolloverOut > 0 ? (
                        <span className="text-[10px] text-amber-300 font-mono block mt-1">
                          ↳ Rollover to next month: {formatCurrency(lastSimulation.jackpotRolloverOut)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-300 font-mono block mt-1">
                          ↳ Claimed by {lastSimulation.tier5Winners.length} winner!
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-surface-border">
                      <p className="font-semibold text-slate-300">4-Number Match (35%)</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(lastSimulation.tier4Share)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Winners: {lastSimulation.tier4Winners.length} ({lastSimulation.tier4Winners.length > 0 ? formatCurrency(Math.round(lastSimulation.tier4Share / lastSimulation.tier4Winners.length)) : '$0'} each)
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-surface-border">
                      <p className="font-semibold text-slate-300">3-Number Match (25%)</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(lastSimulation.tier3Share)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Winners: {lastSimulation.tier3Winners.length} ({lastSimulation.tier3Winners.length > 0 ? formatCurrency(Math.round(lastSimulation.tier3Share / lastSimulation.tier3Winners.length)) : '$0'} each)
                      </p>
                    </div>
                  </div>

                  {/* Matched Subscribers List */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 font-mono mb-2">
                      Matching Subscribers in Active Pool
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-surface-border text-slate-400 text-[10px] uppercase font-mono">
                            <th className="pb-2">User</th>
                            <th className="pb-2">Tier Match</th>
                            <th className="pb-2">Matched Numbers</th>
                            <th className="pb-2">Prize</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                          {lastSimulation.allWinners.map((w, idx) => (
                            <tr key={idx} className="hover:bg-surface-light/30">
                              <td className="py-2.5 font-medium text-white">{w.userName}</td>
                              <td className="py-2.5 font-mono text-gold-300">{w.matchedCount}-Match</td>
                              <td className="py-2.5 font-mono">
                                {w.matchedNumbers.join(', ')}
                              </td>
                              <td className="py-2.5 font-bold font-mono text-emerald-400">
                                {formatCurrency(w.prizeAmount)}
                              </td>
                            </tr>
                          ))}

                          {lastSimulation.allWinners.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-4 text-center text-slate-400">
                                No matches found in this simulation. 5-Match jackpot will roll over automatically.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Play className="w-8 h-8 mx-auto text-amber-400 opacity-60" />
                  <p className="text-sm font-medium text-slate-300">
                    No simulation active yet.
                  </p>
                  <p className="text-xs max-w-sm mx-auto">
                    Click "Run Draw Simulation" on the left to test number frequency matches against active subscribers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 04 WINNERS VERIFICATION TAB (§ 09 & § 11.04) */}
      {activeTab === 'winners' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="pb-4 border-b border-surface-border">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
              § 09 Winner Verification Flow
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Winner Proof Verification & Payout Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verify uploaded screenshots from the golf platform. Review and approve before funds are marked as paid.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Winner</th>
                  <th className="pb-3 font-semibold">Draw</th>
                  <th className="pb-3 font-semibold">Match</th>
                  <th className="pb-3 font-semibold">Prize</th>
                  <th className="pb-3 font-semibold">Proof Status</th>
                  <th className="pb-3 font-semibold">Payout</th>
                  <th className="pb-3 font-semibold text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {allWinners.map(winner => (
                  <tr key={winner.id} className="hover:bg-surface-light/40 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-white">{winner.userName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{winner.userEmail}</p>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {draws.find(d => d.id === winner.drawId)?.monthLabel || winner.drawId}
                    </td>
                    <td className="py-3 font-mono text-gold-300 font-bold">
                      {winner.matchedCount}-Number Match
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(winner.prizeAmount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                          winner.verificationStatus === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : winner.verificationStatus === 'rejected'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {winner.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                          winner.payoutStatus === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {winner.payoutStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setInspectingWinner(winner);
                          setAdminNotes(winner.adminNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-surface-light hover:bg-surface-elevated text-xs font-semibold text-white border border-surface-border transition-colors"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                ))}

                {allWinners.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No winners in record yet. Run and publish a draw to generate winners.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 01 USER MANAGEMENT TAB (§ 11.01) */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="pb-4 border-b border-surface-border">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
              § 11.01 User Management
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Member Profiles & Subscriptions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage user accounts, active subscription states, and inspect score history.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Subscription Status</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Stored Scores (Latest 5)</th>
                  <th className="pb-3 font-semibold text-right">Subscription Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {users.map(u => {
                  const sub = subscriptions[u.id];
                  const userSc = scores
                    .filter(s => s.userId === u.id)
                    .sort((a, b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime())
                    .slice(0, 5);

                  return (
                    <tr key={u.id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="py-3">
                        <p className="font-bold text-white">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                      </td>
                      <td className="py-3 font-mono capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${u.role === 'admin' ? 'bg-amber-400/20 text-amber-300' : 'bg-brand-500/20 text-brand-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] capitalize ${
                            sub?.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {sub?.status || 'No Sub'}
                        </span>
                      </td>
                      <td className="py-3 font-mono capitalize text-slate-300">
                        {sub?.plan || '—'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {userSc.map(sc => (
                            <span key={sc.id} className="w-5 h-5 draw-ball text-[10px]">
                              {sc.score}
                            </span>
                          ))}
                          {userSc.length === 0 && <span className="text-slate-500">—</span>}
                        </div>
                      </td>
                      <td className="py-3 text-right space-x-1">
                        <button
                          onClick={() => adminUpdateUserSubscription(u.id, sub?.status === 'active' ? 'cancelled' : 'active')}
                          className="px-2.5 py-1 rounded bg-surface-light hover:bg-surface-elevated text-[11px] font-semibold text-slate-300 transition-colors"
                        >
                          Toggle {sub?.status === 'active' ? 'Cancel' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 03 CHARITY MANAGEMENT TAB (§ 08 & § 11.03) */}
      {activeTab === 'charities' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                § 11.03 Charity Control
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Charity Listings & Cause Management
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Add, edit, or delete registered charities. Manage content, logos, and fundraising allocations.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCharityId(null);
                setCharityName('');
                setCharityCategory('Youth & Education');
                setCharityTagline('');
                setCharityDescription('');
                setCharityLogo('');
                setCharityHero('');
                setCharityWebsite('');
                setIsCharityModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Charity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map(charity => (
              <div
                key={charity.id}
                className="p-5 rounded-2xl bg-surface-light border border-surface-border flex items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={charity.logoUrl}
                      alt={charity.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{charity.name}</h4>
                      <span className="text-[10px] text-brand-400 font-mono">{charity.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {charity.tagline}
                  </p>
                  <p className="text-xs font-bold font-mono text-emerald-400">
                    Raised: {formatCurrency(charity.totalRaised)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCharityId(charity.id);
                      setCharityName(charity.name);
                      setCharityCategory(charity.category);
                      setCharityTagline(charity.tagline);
                      setCharityDescription(charity.description);
                      setCharityLogo(charity.logoUrl);
                      setCharityHero(charity.heroImageUrl);
                      setCharityWebsite(charity.website);
                      setIsCharityModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-slate-300"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCharity(charity.id)}
                    className="p-1.5 rounded-lg bg-surface hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 05 REPORTS & ANALYTICS TAB (§ 11.05) */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-brand-500/20">
              <span className="text-xs uppercase font-mono text-slate-400">Total Active Members</span>
              <p className="text-3xl font-extrabold text-white mt-2">{totalSubscribers}</p>
              <p className="text-[10px] text-emerald-400 mt-1">100% active retention</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-gold-500/20">
              <span className="text-xs uppercase font-mono text-slate-400">Current Prize Pool</span>
              <p className="text-3xl font-extrabold text-gold-400 mt-2">
                {formatCurrency(activeDraw?.totalPool || 62000)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Includes 5-match jackpot rollover</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-rose-500/20">
              <span className="text-xs uppercase font-mono text-slate-400">Charity Funds Generated</span>
              <p className="text-3xl font-extrabold text-rose-400 mt-2">
                {formatCurrency(totalRaised)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Direct from member subscriptions</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-indigo-500/20">
              <span className="text-xs uppercase font-mono text-slate-400">Prizes Paid Out</span>
              <p className="text-3xl font-extrabold text-indigo-300 mt-2">
                {formatCurrency(totalPaidOut)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Verified and released</p>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Draw Mechanics & Pool Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
                <span className="text-xs text-slate-400">Jackpot Protection</span>
                <p className="text-sm font-bold text-white mt-1">40% Carry-Forward Rule</p>
                <p className="text-xs text-slate-400 mt-1">
                  When 0 members hit the 5-match tier, the balance carries over directly into the next month's pool without dilution.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
                <span className="text-xs text-slate-400">Score Entry Integrity</span>
                <p className="text-sm font-bold text-white mt-1">Strict Single-Date Enforcement</p>
                <p className="text-xs text-slate-400 mt-1">
                  100% of recorded scores conform to Stableford (1–45) and unique calendar date rules.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
                <span className="text-xs text-slate-400">Verification Rate</span>
                <p className="text-sm font-bold text-white mt-1">100% Pre-Payout Audit</p>
                <p className="text-xs text-slate-400 mt-1">
                  Zero automated prize release without signed admin proof verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT & REVIEW MODAL (§ 09) */}
      {inspectingWinner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-surface p-6 sm:p-8 rounded-3xl max-w-lg w-full border-surface-border shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Inspect Winner Score Proof
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Review submitted scorecard for {inspectingWinner.userName} ({formatCurrency(inspectingWinner.prizeAmount)})
                </p>
              </div>
              <button
                onClick={() => setInspectingWinner(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-surface-border bg-black max-h-56 flex items-center justify-center">
                {inspectingWinner.proofImageUrl ? (
                  <img
                    src={inspectingWinner.proofImageUrl}
                    alt="Winner Proof"
                    className="max-h-56 w-full object-contain"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No screenshot uploaded yet by member.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="e.g. Official scorecard confirmed against handicap registry."
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => {
                    adminReviewProof(inspectingWinner.id, 'approved', adminNotes);
                    setInspectingWinner(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-surface text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Proof
                </button>
                <button
                  onClick={() => {
                    adminReviewProof(inspectingWinner.id, 'rejected', adminNotes);
                    setInspectingWinner(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Proof
                </button>
                {inspectingWinner.verificationStatus === 'approved' && inspectingWinner.payoutStatus !== 'paid' && (
                  <button
                    onClick={() => {
                      adminMarkPayout(inspectingWinner.id);
                      setInspectingWinner(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    Mark Payout as Completed ($ Paid)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHARITY MODAL (§ 08 & § 11.03) */}
      {isCharityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-surface p-6 sm:p-8 rounded-3xl max-w-md w-full border-surface-border shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingCharityId ? 'Edit Charity Partner' : 'Add New Charity'}
                </h3>
              </div>
              <button
                onClick={() => setIsCharityModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCharity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Charity Name</label>
                <input
                  type="text"
                  required
                  value={charityName}
                  onChange={e => setCharityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={charityCategory}
                  onChange={e => setCharityCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Youth & Education">Youth & Education</option>
                  <option value="Military & Veterans">Military & Veterans</option>
                  <option value="Health & Cancer">Health & Cancer</option>
                  <option value="Community & Inclusion">Community & Inclusion</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={charityTagline}
                  onChange={e => setCharityTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={charityDescription}
                  onChange={e => setCharityDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={charityLogo}
                  onChange={e => setCharityLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCharityModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-light text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold"
                >
                  Save Charity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
