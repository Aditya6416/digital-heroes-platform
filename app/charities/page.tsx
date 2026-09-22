'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Charity } from '@/lib/types';
import {
  Heart,
  Search,
  Filter,
  Calendar,
  MapPin,
  ExternalLink,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CharitiesDirectoryPage() {
  const { charities, addDonation, userSubscription, updateSubscriptionSettings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Direct Donation Modal state
  const [donationCharity, setDonationCharity] = useState<Charity | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [donorName, setDonorName] = useState<string>('Golf Philanthropist');
  const [donorEmail, setDonorEmail] = useState<string>('donor@example.com');
  const [donationMsg, setDonationMsg] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // Filter charities
  const categories = ['All', 'Youth & Education', 'Military & Veterans', 'Health & Cancer', 'Environment'];

  const filteredCharities = useMemo(() => {
    return charities.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [charities, searchQuery, selectedCategory]);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationCharity || donationAmount <= 0) return;

    addDonation({
      charityId: donationCharity.id,
      donorName: isAnonymous ? 'Anonymous Hero' : donorName,
      donorEmail,
      amount: donationAmount,
      message: donationMsg,
      isAnonymous,
    });

    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setDonationCharity(null);
      setDonationMsg('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-medium text-rose-300">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>§ 08 Charity Directory & Giving Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Where Every Yard Creates Impact
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Discover verified nonprofit partners vetted for maximum transparency. Direct your subscription share or make an independent donation outside gameplay.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search causes, missions, or tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-light border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-surface font-bold shadow'
                  : 'bg-surface-light hover:bg-surface-elevated text-slate-400 hover:text-white border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharities.map(charity => {
          const isUserDesignated = userSubscription?.selectedCharityId === charity.id;

          return (
            <div
              key={charity.id}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border-slate-700/60 hover:border-brand-500/40 transition-all group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={charity.heroImageUrl}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-DEFAULT/90 backdrop-blur-md text-[10px] font-semibold text-brand-300 border border-surface-border">
                    {charity.category}
                  </span>

                  {isUserDesignated && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-500 text-surface text-[10px] font-bold shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Your Active Charity
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={charity.logoUrl}
                      alt={charity.name}
                      className="w-12 h-12 rounded-xl object-cover border border-surface-border"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                        {charity.name}
                      </h3>
                      <a
                        href={charity.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
                      >
                        Official Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-300 leading-relaxed">
                    {charity.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {charity.description}
                  </p>

                  {/* Upcoming Events (§ 08.2) */}
                  {charity.events.length > 0 && (
                    <div className="pt-2 border-t border-surface-border space-y-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">
                        Upcoming Golf Invitational Days
                      </span>
                      {charity.events.map(ev => (
                        <div
                          key={ev.id}
                          className="p-2.5 rounded-xl bg-surface-light border border-surface-border/60 text-xs space-y-1"
                        >
                          <p className="font-bold text-white text-[11px]">{ev.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-brand-400" />
                              {formatDate(ev.eventDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              {ev.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-surface-border/40 mt-4 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Total Impact Funded
                    </span>
                    <span className="text-base font-bold text-brand-400 font-mono">
                      {formatCurrency(charity.totalRaised)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setDonationCharity(charity);
                      setDonationAmount(50);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    Donate Directly
                  </button>
                </div>

                {userSubscription && !isUserDesignated && (
                  <button
                    onClick={() => {
                      updateSubscriptionSettings({ selectedCharityId: charity.id });
                      alert(`Set ${charity.name} as your subscription recipient!`);
                    }}
                    className="w-full py-2 rounded-xl bg-surface-light hover:bg-surface-elevated text-xs font-semibold text-slate-200 border border-surface-border transition-colors"
                  >
                    Select as My Monthly Charity
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DIRECT DONATION MODAL (§ 08.1 Independent donation option, not tied to gameplay) */}
      {donationCharity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-surface p-6 sm:p-8 rounded-3xl max-w-md w-full border-surface-border shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold">
                  § 08.1 Independent Giving
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Direct Donation to {donationCharity.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  100% of this one-time donation goes directly to the cause (not tied to gameplay).
                </p>
              </div>
              <button
                onClick={() => setDonationCharity(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {donationSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Thank You for Your Generosity!</h4>
                <p className="text-xs">
                  Your ${donationAmount} direct donation has been credited to {donationCharity.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 250].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setDonationAmount(amt)}
                        className={`py-2 rounded-xl font-bold font-mono transition-all ${
                          donationAmount === amt
                            ? 'bg-rose-500 text-white shadow'
                            : 'bg-surface-light border border-surface-border text-slate-300 hover:text-white'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                    className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Your Email (for tax receipt)
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={e => setDonorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Dedication Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={donationMsg}
                    onChange={e => setDonationMsg(e.target.value)}
                    placeholder="In honor of..."
                    className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <label htmlFor="anon" className="text-slate-300 cursor-pointer">
                    Make this donation anonymous
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDonationCharity(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-surface-light text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-lg shadow-rose-500/20"
                  >
                    Confirm ${donationAmount} Donation
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
