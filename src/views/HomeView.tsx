/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Gauge,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Grid,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { ALL_LEVELS, getLevelById } from '../data/levels';
import { LevelProgress, UserStats } from '../types/typing';
import { SPONSOR_URLS } from '../data/sponsors';
import { ExternalLink } from 'lucide-react';

interface HomeViewProps {
  levelsProgress: Record<number, LevelProgress>;
  activeLevelId: number;
  stats: UserStats;
  onStartLevel: (levelId: number) => void;
  onNavigateToLevels: (stageFilter?: number) => void;
  onNavigateToSpeedTest: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  levelsProgress,
  activeLevelId,
  stats,
  onStartLevel,
  onNavigateToLevels,
  onNavigateToSpeedTest,
}) => {
  const activeLevel = getLevelById(activeLevelId) || ALL_LEVELS[0];
  const completedLevelsCount = Object.values(levelsProgress).filter((p) => p.completed).length;
  const isReturningUser = completedLevelsCount > 0 || activeLevelId > 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] py-6 px-4 max-w-4xl mx-auto">
      {/* Homepage Sponsor — Link 1 (Compact, professional banner near top) */}
      <div className="w-full mb-6 rounded-2xl border border-[#E1E7EF] bg-white p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#315CE8] border border-[#315CE8]/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#315CE8]">
                Featured Sponsor
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[9px] font-semibold text-[#647184]">
                Partner
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#192230]">
              Discover our featured digital entertainment & media showcase
            </p>
          </div>
        </div>

        <a
          href={SPONSOR_URLS.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#315CE8] hover:bg-[#2546B8] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>Visit Sponsor</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Brand & Introduction */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E1E7EF] bg-white px-3.5 py-1 text-xs font-semibold text-[#315CE8] shadow-xs mb-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#315CE8] text-white font-mono text-[11px] font-bold">
            K
          </div>
          <span>KeySprint Professional Touch Typing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#192230] tracking-tight">
          What would you like to do today?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#647184] max-w-xl mx-auto leading-relaxed">
          Select an option below to begin. No registration, setup wizards, or payment required.
        </p>
      </div>

      {/* Two Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        {/* Card 1: Start Learning / Continue Learning */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onStartLevel(activeLevel.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onStartLevel(activeLevel.id);
          }}
          className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#E1E7EF] bg-white p-7 sm:p-8 text-left transition-all duration-150 hover:border-[#315CE8] hover:shadow-lg hover:shadow-[#315CE8]/5 cursor-pointer"
        >
          <div>
            {/* Card Icon & Tag */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#315CE8] border border-[#315CE8]/20 group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-bold text-[#315CE8]">
                {isReturningUser ? `Resume Lvl ${activeLevel.id}` : '100 Levels'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#192230] group-hover:text-[#315CE8] transition-colors">
              {isReturningUser ? 'Continue Learning' : 'Start Learning'}
            </h2>
            <p className="mt-2 text-sm text-[#647184] leading-relaxed">
              {isReturningUser
                ? `Continue Level ${activeLevel.id}: "${activeLevel.title}" with real-time hand guidance.`
                : 'Learn touch typing step by step, starting with your first keys on the home row.'}
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#E1E7EF] flex items-center justify-between">
            <span className="text-xs font-medium text-[#8692A6]">
              {isReturningUser ? `${completedLevelsCount} of 100 passed` : 'For beginners & all levels'}
            </span>
            <div className="flex items-center gap-2 rounded-xl bg-[#315CE8] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs group-hover:bg-[#2546B8] transition-colors">
              <span>{isReturningUser ? `Resume Level ${activeLevel.id}` : 'Start Level 1'}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Card 2: Take a Typing Test */}
        <div
          role="button"
          tabIndex={0}
          onClick={onNavigateToSpeedTest}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateToSpeedTest();
          }}
          className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#E1E7EF] bg-white p-7 sm:p-8 text-left transition-all duration-150 hover:border-[#117C78] hover:shadow-lg hover:shadow-[#117C78]/5 cursor-pointer"
        >
          <div>
            {/* Card Icon & Tag */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#117C78] border border-[#117C78]/20 group-hover:scale-105 transition-transform">
                <Gauge className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#117C78]">
                1, 3, or 5 Min
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#192230] group-hover:text-[#117C78] transition-colors">
              Take a Typing Test
            </h2>
            <p className="mt-2 text-sm text-[#647184] leading-relaxed">
              Measure your typing speed and accuracy under standardized timers and receive an instant speed evaluation.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#E1E7EF] flex items-center justify-between">
            <span className="text-xs font-medium text-[#8692A6]">
              {stats.highestWpm > 0 ? `Best record: ${stats.highestWpm} WPM` : 'Standardized WPM test'}
            </span>
            <div className="flex items-center gap-2 rounded-xl bg-[#117C78] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs group-hover:bg-[#0E6461] transition-colors">
              <span>Start Speed Test</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Clean Navigation Strip */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#647184]">
        <button
          type="button"
          onClick={() => onNavigateToLevels()}
          className="flex items-center gap-1.5 hover:text-[#315CE8] transition-colors px-2 py-1 rounded-md"
        >
          <Grid className="h-3.5 w-3.5" />
          <span>Browse All 100 Levels</span>
        </button>

        <span className="text-[#CBD5E1]">•</span>

        <button
          type="button"
          onClick={() => onStartLevel(1)}
          className="flex items-center gap-1.5 hover:text-[#315CE8] transition-colors px-2 py-1 rounded-md"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Level 1: F & J Anchors</span>
        </button>

        {completedLevelsCount > 0 && (
          <>
            <span className="text-[#CBD5E1]">•</span>
            <span className="inline-flex items-center gap-1 text-[#16845B]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completedLevelsCount} Levels Completed</span>
            </span>
          </>
        )}
      </div>

      {/* Bottom Partner Exploration Card */}
      <div className="mt-8 w-full rounded-2xl border border-[#E1E7EF] bg-gradient-to-r from-[#EEF3FF] via-white to-slate-50 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#315CE8] text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#315CE8]">
                Featured Partner
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold text-[#16845B]">
                Verified
              </span>
            </div>
            <p className="text-sm font-bold text-[#192230]">
              KeySprint Recommended Partner Showcase
            </p>
            <p className="text-xs text-[#647184]">
              Explore premier external digital media and partner channels.
            </p>
          </div>
        </div>

        <a
          href={SPONSOR_URLS.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 rounded-xl bg-[#315CE8] hover:bg-[#2546B8] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all cursor-pointer"
        >
          <span>Explore Partner</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

