/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, CheckCircle, Star, Search, Play, Trophy, Sparkles } from 'lucide-react';
import { ALL_LEVELS } from '../data/levels';
import { STAGES } from '../data/stages';
import { LevelProgress } from '../types/typing';
import { NativeAd } from '../components/NativeAd';
import { ResponsiveAdLeaderboard } from '../components/AdBanner';

interface AllLevelsViewProps {
  levelsProgress: Record<number, LevelProgress>;
  activeLevelId: number;
  initialStageFilter?: number;
  onSelectLevel: (levelId: number) => void;
}

export const AllLevelsView: React.FC<AllLevelsViewProps> = ({
  levelsProgress,
  activeLevelId,
  initialStageFilter = 0,
  onSelectLevel,
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(initialStageFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLevels = ALL_LEVELS.filter((level) => {
    if (selectedStage !== 0 && level.stageId !== selectedStage) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = level.title.toLowerCase().includes(q);
      const matchObjective = level.objective.toLowerCase().includes(q);
      const matchId = level.id.toString() === q;
      const matchKeys = level.newKeys.some((k) => k.toLowerCase() === q);
      return matchTitle || matchObjective || matchId || matchKeys;
    }
    return true;
  });

  const totalCompleted = Object.values(levelsProgress).filter((p) => p.completed).length;
  const totalStars = Object.values(levelsProgress).reduce((acc, p) => acc + (p.stars || 0), 0);

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-7 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-bold text-[#315CE8] border border-[#315CE8]/20 mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Complete 100-Level Curriculum Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192230] tracking-tight">
            All 100 Typing Levels
          </h1>
          <p className="text-xs sm:text-sm text-[#647184] mt-1 max-w-xl">
            Pass each assessment to unlock subsequent lessons. Level 1 is unlocked by default.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#E1E7EF] bg-[#F8FAFC] px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-[#647184]">Completed</span>
            <div className="text-lg font-bold text-[#192230] font-mono">{totalCompleted} / 100</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800">Total Stars</span>
            <div className="text-lg font-bold text-amber-700 font-mono">{totalStars} / 300</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Stage Filter Tabs */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStage(0)}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedStage === 0
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230]'
            }`}
          >
            All 100 Levels
          </button>
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStage(s.id)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedStage === s.id
                  ? 'bg-[#315CE8] text-white shadow-xs'
                  : 'border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230]'
              }`}
            >
              Stage {s.number}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8692A6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search level, key, or skill..."
            className="w-full rounded-xl border border-[#E1E7EF] bg-white pl-9 pr-3 py-1.5 text-xs text-[#192230] placeholder-[#8692A6] focus:border-[#315CE8] focus:outline-none transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Native Sponsored Banner */}
      <NativeAd />

      {/* 100 Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredLevels.map((lvl) => {
          const prog = levelsProgress[lvl.id] || {
            levelId: lvl.id,
            completed: false,
            unlocked: lvl.id === 1,
            stars: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            bestCpm: 0,
            attempts: 0,
          };

          const isUnlocked = prog.unlocked;
          const isCompleted = prog.completed;
          const isCurrentActive = lvl.id === activeLevelId;

          return (
            <div
              key={lvl.id}
              onClick={() => {
                if (isUnlocked) onSelectLevel(lvl.id);
              }}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-150 ${
                isCurrentActive
                  ? 'border-[#315CE8] ring-2 ring-[#315CE8]/20 bg-white shadow-md'
                  : isUnlocked
                  ? 'cursor-pointer border-[#E1E7EF] bg-white hover:border-slate-300 hover:shadow-xs shadow-2xs'
                  : 'border-[#E1E7EF]/60 bg-[#F8FAFC] opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Level Header Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-50 text-[#16845B] border border-emerald-200'
                          : isUnlocked
                          ? 'bg-[#EEF3FF] text-[#315CE8] border border-[#315CE8]/30'
                          : 'bg-slate-100 text-[#A0A9B6]'
                      }`}
                    >
                      {lvl.id}
                    </span>
                    <span className="text-[11px] font-semibold text-[#647184]">
                      Stage {lvl.stageId}
                    </span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= prog.stars ? 'fill-[#E8AC45] text-[#E8AC45]' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  ) : isUnlocked ? (
                    <span className="rounded-full bg-[#EEF3FF] px-2 py-0.5 text-[10px] font-bold text-[#315CE8]">
                      Ready
                    </span>
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-[#A0A9B6]" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#192230] line-clamp-1">
                  {lvl.title}
                </h3>
                <p className="mt-1 text-xs text-[#647184] line-clamp-2 leading-relaxed">
                  {lvl.objective}
                </p>

                {lvl.newKeys && lvl.newKeys.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1">
                    <span className="text-[10px] text-[#8692A6] font-semibold uppercase">Keys:</span>
                    {lvl.newKeys.map((k, kIdx) => (
                      <span
                        key={kIdx}
                        className="rounded bg-[#F1F5F9] border border-[#E1E7EF] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#192230]"
                      >
                        {k === ' ' ? 'Space' : k}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Criteria & Action */}
              <div className="mt-4 pt-3 border-t border-[#E1E7EF] flex items-center justify-between text-xs">
                {isCompleted ? (
                  <div>
                    <span className="text-[10px] text-[#8692A6] block uppercase font-medium">
                      Best Record
                    </span>
                    <span className="font-bold text-[#16845B] font-mono">
                      {prog.bestWpm} WPM • {prog.bestAccuracy}%
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] text-[#8692A6] block uppercase font-medium">
                      Passing Target
                    </span>
                    <span className="text-[#647184] text-[11px] font-mono">
                      {lvl.minAccuracy}% acc • {lvl.targetWpm} wpm
                    </span>
                  </div>
                )}

                {isUnlocked && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel(lvl.id);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-[#315CE8] hover:bg-[#2546B8] text-white px-2.5 py-1 text-xs font-bold transition-all shadow-xs"
                  >
                    <span>{isCompleted ? 'Repeat' : 'Start'}</span>
                    <Play className="h-3 w-3 fill-current" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
