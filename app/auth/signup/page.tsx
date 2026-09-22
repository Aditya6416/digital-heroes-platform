'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sparkles, Heart, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'yearly' ? 'yearly' : 'monthly';

  const { charities, login, updateSubscriptionSettings } = useStore();

  const [plan, setPlan] = useState<'monthly' | 'yearly'>(initialPlan);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handicap, setHandicap] = useState('14.2');
  const [charityId, setCharityId] = useState(charities[0]?.id || '');
  const [charityPercentage, setCharityPercentage] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    // Register & log in
    login(email, 'subscriber');

    // Configure subscription (§ 04, § 08)
    updateSubscriptionSettings({
      plan,
      selectedCharityId: charityId,
      charityPercentage,
      status: 'active',
    });

    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-14 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Join Digital Heroes
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Start logging Stableford scores, competing in monthly prize pools, and giving back to vetted charities.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-surface-border space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Step 1: Choose Subscription Plan (§ 04) */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-300">
              1. Choose Subscription Plan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlan('monthly')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  plan === 'monthly'
                    ? 'bg-brand-500/10 border-brand-500 text-white'
                    : 'bg-surface-light border-surface-border text-slate-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Monthly</span>
                  <span className="text-xs font-mono font-bold">$19/mo</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Flexible month-to-month</p>
              </button>

              <button
                type="button"
                onClick={() => setPlan('yearly')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  plan === 'yearly'
                    ? 'bg-brand-500/10 border-brand-500 text-white'
                    : 'bg-surface-light border-surface-border text-slate-400'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-amber-400 text-surface text-[9px] font-black">
                  SAVE 21%
                </span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Yearly</span>
                  <span className="text-xs font-mono font-bold">$180/yr</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">$15/mo billed annually</p>
              </button>
            </div>
          </div>

          {/* Step 2: Select Charity Recipient (§ 08.1) */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-300">
              2. Designate Charity & Contribution Percentage (Min. 10%)
            </label>
            <select
              value={charityId}
              onChange={e => setCharityId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
            >
              {charities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-slate-400">Subscription Portion to Charity:</span>
                <span className="font-bold text-rose-400 font-mono">{charityPercentage}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={charityPercentage}
                onChange={e => setCharityPercentage(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-surface-light rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>10% Required Minimum</span>
                <span>50% Max Philanthropic Share</span>
              </div>
            </div>
          </div>

          {/* Step 3: Member Profile */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <label className="block font-semibold text-slate-300">
              3. Account & Golf Profile
            </label>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Spieth"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Handicap Index</label>
                <input
                  type="text"
                  value={handicap}
                  onChange={e => setHandicap(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-brand-400" />
            <span>
              Simulated PCI payment activated. No charge during selection review. Instant active status.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Subscription & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-surface-border pt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400 text-xs">Loading onboarding...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
