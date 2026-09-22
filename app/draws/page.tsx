'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Trophy,
  Sparkles,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  Repeat,
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function DrawsExplorerPage() {
  const { draws, activeDraw, userScores } = useStore();

  const publishedDraws = draws
    .filter(d => d.status === 'published')
    .sort((a, b) => new Date(b.executedAt || b.scheduledDate).getTime() - new Date(a.executedAt || a.scheduledDate).getTime());

  const currentJackpot = activeDraw ? activeDraw.tier5Share : 41400;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs font-medium text-gold-300">
          <Trophy className="w-3.5 h-3.5 text-gold-400" />
          <span>§ 06 & § 07 Draw Engine & Prize Pool Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Monthly Draws & Rollover Jackpots
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Every month, 40% of all subscription revenue creates a high-stakes prize pool. Match your 5 active Stableford scores against the drawn numbers to win.
        </p>
      </div>

      {/* Featured Current Jackpot Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden border-gold-500/30 shadow-2xl shadow-gold-500/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold">
                Next Live Draw · {activeDraw?.monthLabel || 'October 2026'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-mono">
                Monthly Cadence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Estimated Total Pool: <span className="text-gold-400">{formatCurrency(activeDraw?.totalPool || 62000)}</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Includes guaranteed base pool from active subscriber fees plus the 5-match jackpot rollover. If no player matches all 5 numbers, the 40% jackpot carries forward!
            </p>

            {/* Current user's ticket preview */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">Your Entered Numbers:</span>
              <div className="flex items-center gap-1.5">
                {userScores.length > 0 ? (
                  userScores.map(sc => (
                    <span key={sc.id} className="w-8 h-8 draw-ball text-xs">
                      {sc.score}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    No scores entered yet ·{' '}
                    <Link href="/dashboard" className="text-brand-400 hover:underline">
                      Enter 5 Scores in Dashboard →
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Jackpot counter box */}
          <div className="p-6 rounded-2xl bg-surface-light border border-gold-500/40 text-center space-y-3">
            <span className="text-[11px] uppercase font-mono text-slate-400 tracking-wider">
              5-Match Grand Jackpot
            </span>
            <p className="text-4xl font-extrabold text-gold-400">
              {formatCurrency(currentJackpot)}
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-surface-border">
              Scheduled execution: {activeDraw ? formatDate(activeDraw.scheduledDate) : 'Oct 31, 2026'}
            </div>
            <Link
              href="/dashboard"
              className="block w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-surface text-xs font-bold shadow-md transition-all"
            >
              Verify My Active Scores
            </Link>
          </div>
        </div>
      </div>

      {/* Prize Pool Distribution Breakdown (§ 07) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 5 */}
        <div className="glass-panel p-6 rounded-2xl border-gold-500/40 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono uppercase text-gold-400 font-bold">Grand Prize</span>
              <h3 className="text-lg font-bold text-white mt-0.5">5-Number Match</h3>
            </div>
            <span className="text-sm font-black text-gold-400 font-mono">40% Pool</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Match all 5 of your latest Stableford scores against the drawn numbers. Split equally among winners.
          </p>
          <div className="pt-2 border-t border-surface-border flex items-center gap-1.5 text-xs text-amber-300 font-mono">
            <Repeat className="w-3.5 h-3.5" />
            <span>Jackpot Rollover if unclaimed</span>
          </div>
        </div>

        {/* Tier 4 */}
        <div className="glass-panel p-6 rounded-2xl border-slate-700 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Second Tier</span>
              <h3 className="text-lg font-bold text-white mt-0.5">4-Number Match</h3>
            </div>
            <span className="text-sm font-black text-white font-mono">35% Pool</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Match 4 of your 5 scores. High probability reward distributed to skilled and consistent Stableford rounds.
          </p>
          <div className="pt-2 border-t border-surface-border text-xs text-slate-400 font-mono">
            <span>No rollover · split equally</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="glass-panel p-6 rounded-2xl border-slate-700 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Third Tier</span>
              <h3 className="text-lg font-bold text-white mt-0.5">3-Number Match</h3>
            </div>
            <span className="text-sm font-black text-white font-mono">25% Pool</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Match 3 of your 5 scores. Broadest prize tier ensuring regular member wins and continuous engagement.
          </p>
          <div className="pt-2 border-t border-surface-border text-xs text-slate-400 font-mono">
            <span>No rollover · split equally</span>
          </div>
        </div>
      </div>

      {/* Historical Published Draws (§ 06 & § 07) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="pb-4 border-b border-surface-border">
          <h3 className="text-xl font-bold text-white">Past Monthly Draw Archive</h3>
          <p className="text-xs text-slate-400 mt-1">
            Audit trail of previous winning numbers, pool distribution, and rollover records.
          </p>
        </div>

        <div className="space-y-6">
          {publishedDraws.map(draw => (
            <div
              key={draw.id}
              className="p-6 rounded-2xl bg-surface-light border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-white">{draw.monthLabel}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-brand-300 capitalize">
                    {draw.mode} draw logic
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Executed {draw.executedAt ? formatDate(draw.executedAt) : formatDate(draw.scheduledDate)}
                  </span>
                </div>

                {/* Winning Balls */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono mr-2">Winning Numbers:</span>
                  {draw.winningNumbers.map(n => (
                    <span key={n} className="w-8 h-8 draw-ball-gold text-xs">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pool & Rollover Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-surface border border-surface-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Pool</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(draw.totalPool)}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-surface-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Winners</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {draw.winnersCount.tier5 + draw.winnersCount.tier4 + draw.winnersCount.tier3} members
                  </span>
                </div>

                {draw.jackpotRolloverOut > 0 ? (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block uppercase">Rollover Out</span>
                    <span className="text-sm font-bold text-gold-400">
                      {formatCurrency(draw.jackpotRolloverOut)}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-300 block uppercase">Jackpot Result</span>
                    <span className="text-sm font-bold text-emerald-400">Won & Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
