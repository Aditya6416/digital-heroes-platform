import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-surface" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                digital<span className="text-brand-400">.HEROES</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A golf performance and charity draw platform. Combining verified Stableford score tracking with life-changing philanthropic impact and monthly prize draws.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              PRD Level 1 Edition · 2026 Sample Assignment
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-brand-400 transition-colors">
                  5-Score Rolling Engine
                </Link>
              </li>
              <li>
                <Link href="/draws" className="hover:text-brand-400 transition-colors">
                  Monthly Draws & Jackpot Rollover
                </Link>
              </li>
              <li>
                <Link href="/charities" className="hover:text-brand-400 transition-colors">
                  Charity Directory & Direct Giving
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-400 transition-colors">
                  Winner Verification & Payouts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Operational Standards
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-brand-400" />
                <span>PCI-DSS Payment Compliance</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-brand-400" />
                <span>Stableford Strict Date Uniqueness</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Minimum 10% Charity Guarantee</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface-light p-4 rounded-xl border border-surface-border">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Demo Test Credentials
            </h4>
            <div className="text-xs space-y-1.5 text-slate-400">
              <div className="p-2 rounded bg-surface border border-surface-border">
                <p className="text-[11px] font-semibold text-brand-300">Subscriber Persona</p>
                <p className="font-mono text-[11px] text-slate-300">subscriber@digitalheroes.com</p>
                <p className="text-[10px] text-slate-500">Password: password123</p>
              </div>
              <div className="p-2 rounded bg-surface border border-surface-border">
                <p className="text-[11px] font-semibold text-amber-300">Admin Persona</p>
                <p className="font-mono text-[11px] text-slate-300">admin@digitalheroes.com</p>
                <p className="text-[10px] text-slate-500">Password: admin123</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Digital Heroes. All rights reserved. “Feel, not fairway.”</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors">Draw Official Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
