'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Trophy, 
  Heart, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  Layers,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, userSubscription, logout, quickSwitchRole } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo (§ 01 & PRD aesthetic) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-surface-DEFAULT" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                digital<span className="text-brand-400">.HEROES</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-400 font-mono">
                Performance · Charity · Draws
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-brand-400 bg-surface-light' 
                  : 'text-slate-300 hover:text-white hover:bg-surface-light/60'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/charities"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/charities')
                  ? 'text-brand-400 bg-surface-light'
                  : 'text-slate-300 hover:text-white hover:bg-surface-light/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              Charities
            </Link>
            <Link
              href="/draws"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/draws')
                  ? 'text-brand-400 bg-surface-light'
                  : 'text-slate-300 hover:text-white hover:bg-surface-light/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-gold-400" />
              Monthly Draws
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                    : 'text-amber-300/80 hover:text-amber-300 hover:bg-surface-light/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Panel
              </Link>
            )}
            {currentUser && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-brand-400 bg-surface-light'
                    : 'text-slate-300 hover:text-white hover:bg-surface-light/60'
                }`}
              >
                <Layers className="w-4 h-4 text-brand-400" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action & User Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-full bg-surface-light border border-surface-border hover:border-slate-600 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-brand-400 leading-tight capitalize">
                      {currentUser.role} · {userSubscription?.status === 'active' ? 'Active Sub' : 'No Sub'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-surface border border-surface-border shadow-2xl p-2 z-50"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="p-3 border-b border-surface-border mb-2">
                      <p className="text-xs font-medium text-slate-400">Logged in as</p>
                      <p className="text-sm font-bold text-white truncate">{currentUser.email}</p>
                      <p className="text-[11px] text-brand-400 mt-1 capitalize font-mono">
                        Role: {currentUser.role}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-surface-light rounded-lg transition-colors"
                    >
                      <Layers className="w-4 h-4 text-brand-400" />
                      User Dashboard & Scores
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Admin Management Console
                      </Link>
                    )}

                    <div className="my-2 border-t border-surface-border" />

                    <div className="px-3 py-1">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
                        Quick Evaluator Switch
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            quickSwitchRole('subscriber');
                            setIsDropdownOpen(false);
                          }}
                          className="text-left px-2 py-1.5 text-xs rounded bg-surface-light hover:bg-surface-elevated text-slate-300 font-medium"
                        >
                          👤 Subscriber
                        </button>
                        <button
                          onClick={() => {
                            quickSwitchRole('admin');
                            setIsDropdownOpen(false);
                          }}
                          className="text-left px-2 py-1.5 text-xs rounded bg-surface-light hover:bg-surface-elevated text-amber-300 font-medium"
                        >
                          🛡️ Admin
                        </button>
                      </div>
                    </div>

                    <div className="my-2 border-t border-surface-border" />

                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-surface-DEFAULT text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
                >
                  Subscribe & Play
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-surface-light rounded-lg"
          >
            Overview
          </Link>
          <Link
            href="/charities"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-surface-light rounded-lg"
          >
            Charity Directory
          </Link>
          <Link
            href="/draws"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-surface-light rounded-lg"
          >
            Monthly Draws & Rollovers
          </Link>
          {currentUser && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-400 hover:bg-surface-light rounded-lg"
            >
              Subscriber Dashboard
            </Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-amber-400 hover:bg-surface-light rounded-lg"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-surface-border">
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-rose-400"
              >
                Sign Out ({currentUser.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-slate-300 bg-surface-light rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-surface-DEFAULT bg-brand-500 rounded-lg"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
