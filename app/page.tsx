'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  Trophy, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Gift,
  Coins,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { charities, activeDraw, userSubscription } = useStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const featuredCharities = charities.filter(c => c.isFeatured);
  const totalRaisedAcrossCharities = charities.reduce((acc, c) => acc + c.totalRaised, 0);
  const currentJackpot = activeDraw ? activeDraw.tier5Share : 41400;

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-96 h-96 bg-gold-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-light border border-surface-border text-xs font-medium text-slate-300 shadow-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Feel, not fairway · The modern philanthropic sport engine</span>
            </div>

            {/* Main Headline (§ 10 & § 12) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Your game.<br />
              <span className="bg-gradient-to-r from-brand-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Every swing gives back.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Track your 5 latest Stableford scores, fund verified causes you care about, and compete in monthly draw prize pools with rolling jackpots.
            </p>

            {/* Quick Live Stats Pill */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 max-w-xl mx-auto">
              <div className="glass-panel p-4 rounded-2xl text-center border-emerald-500/20">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Jackpot Rollover</p>
                <p className="text-2xl sm:text-3xl font-bold text-gold-400 mt-1">
                  {formatCurrency(currentJackpot)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">5-Number Match</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl text-center border-brand-500/20">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Total Impact Raised</p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-400 mt-1">
                  {formatCurrency(totalRaisedAcrossCharities)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Directed by Members</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl text-center border-slate-700/50 col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Min. Charity Share</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  10% Guaranteed
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Or increase anytime</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-DEFAULT font-bold text-base shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Subscribe & Enter Scores</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/charities"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-light hover:bg-surface-elevated text-slate-200 border border-surface-border font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Explore Charities</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives Flow (§ 02 & § 03) */}
      <section className="py-16 bg-surface/60 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest text-brand-400 font-mono font-semibold">
              The Digital Heroes Model
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Three seamless pillars. One platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel p-8 rounded-2xl relative space-y-4 hover:border-brand-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Rolling 5-Score Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log your Stableford scores (1–45) from any course. Our automated rolling engine retains your latest 5 rounds, pruning older scores seamlessly with strict single-score-per-day integrity.
              </p>
              <div className="flex items-center gap-1.5 pt-2 text-xs text-brand-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Stableford 1-45 · Auto-prune oldest</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 rounded-2xl relative space-y-4 hover:border-rose-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Direct Your Impact</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose where your subscription goes. At least 10% automatically funds verified causes—from junior scholarships to veterans—with the option to voluntarily raise your percentage.
              </p>
              <div className="flex items-center gap-1.5 pt-2 text-xs text-rose-300 font-mono">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>10% min · Direct donation options</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 rounded-2xl relative space-y-4 hover:border-gold-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Monthly Draw & Rollovers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                40% of all subscription revenue fuels the monthly prize pool. Match 3, 4, or all 5 numbers against your verified scores. If no one hits the 5-match jackpot, it rolls over!
              </p>
              <div className="flex items-center gap-1.5 pt-2 text-xs text-gold-300 font-mono">
                <Trophy className="w-4 h-4 text-gold-400" />
                <span>5-match 40% · 4-match 35% · 3-match 25%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charity Spotlight (§ 08.2) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-rose-400 font-mono font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Charity Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Causes supported by Digital Heroes
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Every subscription creates tangible grassroots change. Explore featured charity partners or donate directly.
              </p>
            </div>
            <Link
              href="/charities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              <span>View full directory ({charities.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCharities.map(charity => (
              <div
                key={charity.id}
                className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-500/50 transition-all group"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={charity.heroImageUrl}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-DEFAULT/90 backdrop-blur-md text-[10px] font-semibold text-brand-300 border border-surface-border">
                    {charity.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                      {charity.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {charity.tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Funds Raised</span>
                      <span className="text-base font-bold text-brand-400">{formatCurrency(charity.totalRaised)}</span>
                    </div>

                    <Link
                      href={`/charities?select=${charity.id}`}
                      className="px-3 py-1.5 rounded-lg bg-surface-light hover:bg-surface-elevated text-xs font-semibold text-white border border-surface-border transition-colors"
                    >
                      Support Cause
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Pricing Plans (§ 04) */}
      <section className="py-20 bg-surface/40 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-400 font-mono font-semibold">
              Transparent Membership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Subscribe once. Give continuously.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Access real-time score tracking, automated draw entry every month, and complete charitable attribution.
            </p>

            {/* Toggle Monthly vs Yearly */}
            <div className="inline-flex items-center p-1 rounded-xl bg-surface-light border border-surface-border mt-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-brand-500 text-surface shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Plan
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-brand-500 text-surface shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Yearly Plan</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-surface font-extrabold">
                  SAVE 21%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Card */}
            <div className="glass-panel p-8 rounded-3xl relative flex flex-col justify-between border-slate-700/60">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">Monthly Hero</h3>
                    <p className="text-xs text-slate-400">Flexibility to cancel or renew month-to-month</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>5-score rolling Stableford tracker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Automatic entry into every monthly prize draw</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Direct 10%–50% to your selected charity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Instant winner verification and payout dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/auth/signup?plan=monthly"
                  className="block w-full py-3.5 text-center rounded-xl bg-surface-light hover:bg-surface-elevated text-white font-bold text-sm border border-surface-border transition-colors"
                >
                  Start Monthly Membership
                </Link>
              </div>
            </div>

            {/* Yearly Card (Featured) */}
            <div className="glass-panel p-8 rounded-3xl relative flex flex-col justify-between border-brand-500/50 shadow-2xl shadow-brand-500/10">
              <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-gradient-to-r from-brand-400 to-emerald-500 text-surface font-black text-[10px] tracking-wider uppercase">
                Best Value
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Annual Patron</h3>
                  <p className="text-xs text-slate-400">12 uninterrupted months of draws and impact</p>
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white">$180</span>
                  <span className="text-slate-400 text-sm"> / year ($15/mo)</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Save $48 annually (over 2 months free)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Guaranteed continuous entry in 12 monthly draws</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Year-round philanthropic contribution impact reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>VIP invitation access to Charity Golf Days & Clinics</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/auth/signup?plan=yearly"
                  className="block w-full py-3.5 text-center rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-DEFAULT font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01]"
                >
                  Join Annual Membership ($180/yr)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
