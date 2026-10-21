/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { SPONSOR_URLS } from '../data/sponsors';

interface SponsorInterstitialProps {
  isOpen: boolean;
  onContinue: () => void;
  nextChallengeTitle?: string;
}

export const SponsorInterstitial: React.FC<SponsorInterstitialProps> = ({
  isOpen,
  onContinue,
  nextChallengeTitle,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      return;
    }

    setSecondsRemaining(5);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const canContinue = secondsRemaining === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-[#E1E7EF] bg-white p-7 sm:p-9 text-center shadow-2xl">
        {/* Header Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#315CE8] border border-[#315CE8]/20 mb-4 shadow-xs">
          <Sparkles className="h-7 w-7 text-[#315CE8]" />
        </div>

        {/* Badge & Mandatory Header */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#647184] mb-3">
          <ShieldCheck className="h-3.5 w-3.5 text-[#315CE8]" />
          <span>Sponsored Message</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#192230] tracking-tight">
          Sponsored Content
        </h2>

        <p className="mt-2 text-sm text-[#647184] leading-relaxed">
          Discover our featured sponsor.
        </p>

        {/* Professional Sponsor Card */}
        <div className="my-6 rounded-2xl border border-[#E1E7EF] bg-gradient-to-br from-[#F8FAFC] to-[#EEF3FF]/40 p-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#315CE8]">
              Featured Partner
            </span>
            <span className="text-[10px] font-medium text-[#8692A6]">
              External Link
            </span>
          </div>

          <h3 className="text-base font-bold text-[#192230]">
            Global Digital & Entertainment Showcase
          </h3>
          <p className="mt-1 text-xs text-[#647184] leading-relaxed">
            Explore curated digital experiences, streaming media collections, and innovative partner offerings.
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E1E7EF]">
            <span className="text-[11px] font-mono text-[#8692A6] truncate max-w-[200px]">
              asiafilm.org
            </span>
            <a
              href={SPONSOR_URLS.completedChallenge}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#315CE8] hover:bg-[#2546B8] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Visit Sponsor</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Distinct Non-Mandatory Continue Button with 5-Second Countdown */}
        <div className="pt-2 flex flex-col items-center gap-3">
          {!canContinue ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#647184] w-full justify-center">
              <Clock className="h-4 w-4 animate-spin text-[#315CE8]" />
              <span>
                Continue available in {secondsRemaining} second{secondsRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#16845B] hover:bg-[#126b4a] px-5 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <span>Continue to Next Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {nextChallengeTitle && (
            <p className="text-[11px] text-[#8692A6]">
              Next up: <span className="font-semibold text-[#647184]">{nextChallengeTitle}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
