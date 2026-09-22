'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Shield, UserCheck, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RoleQuickSwitcher() {
  const { currentUser, quickSwitchRole } = useStore();

  return (
    <div className="bg-surface-elevated/90 backdrop-blur-sm border-b border-surface-border text-xs py-1.5 px-4 sticky top-0 z-[60] shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Digital Heroes Evaluator Bar:</span>
          <span>Current Persona:</span>
          <span className="font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-white capitalize">
            {currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Public Visitor'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">1-Click Test Persona:</span>
          <button
            onClick={() => quickSwitchRole('subscriber')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              currentUser?.role === 'subscriber'
                ? 'bg-brand-500 text-surface font-bold shadow'
                : 'bg-surface hover:bg-surface-light text-slate-300 border border-surface-border'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Subscriber
          </button>
          <button
            onClick={() => quickSwitchRole('admin')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-amber-400 text-surface font-bold shadow'
                : 'bg-surface hover:bg-surface-light text-amber-300 border border-amber-500/30'
            }`}
          >
            <Shield className="w-3 h-3" />
            Administrator
          </button>
          <button
            onClick={() => quickSwitchRole('visitor')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              !currentUser
                ? 'bg-slate-200 text-surface font-bold shadow'
                : 'bg-surface hover:bg-surface-light text-slate-400 border border-surface-border'
            }`}
          >
            <Eye className="w-3 h-3" />
            Public Visitor
          </button>
          {currentUser?.role === 'admin' && (
            <Link
              href="/admin"
              className="ml-2 text-amber-400 hover:underline font-mono text-[11px] font-semibold"
            >
              Open Admin Console →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
