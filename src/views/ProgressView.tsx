/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  Award,
  Star,
  CheckCircle,
  Flame,
  Zap,
  Target,
  Clock,
  History,
} from 'lucide-react';
import { STAGES } from '../data/stages';
import { LevelProgress, UserStats } from '../types/typing';
import { formatTime } from '../utils/typingLogic';
import { NativeAd } from '../components/NativeAd';

interface ProgressViewProps {
  levelsProgress: Record<number, LevelProgress>;
  stats: UserStats;
  onOpenDiploma: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  levelsProgress,
  stats,
  onOpenDiploma,
}) => {
  const completedLevels = Object.values(levelsProgress).filter((p) => p.completed).length;
  const totalStars = Object.values(levelsProgress).reduce((acc, p) => acc + (p.stars || 0), 0);

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-bold text-[#315CE8] border border-[#315CE8]/20 mb-2">
            <Trophy className="h-3.5 w-3.5" />
            <span>Mastery Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192230] tracking-tight">
            My Typing Progress
          </h1>
          <p className="text-xs sm:text-sm text-[#647184] mt-1 max-w-xl">
            Track your journey across all 100 levels from home row fundamentals to certified typing master.
          </p>
        </div>

        {/* Certificate Button */}
        <button
          type="button"
          onClick={onOpenDiploma}
          className="flex items-center gap-2 rounded-xl bg-[#315CE8] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2546B8] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Award className="h-4 w-4" />
          <span>View Master Diploma</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <CheckCircle className="h-4 w-4 text-[#16845B] mx-auto mb-1.5" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Completed</span>
          <div className="text-xl font-bold text-[#192230] font-mono tabular-nums mt-0.5">
            {completedLevels} <span className="text-xs text-[#8692A6] font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">{Math.round((completedLevels / 100) * 100)}% overall</span>
        </div>

        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <Star className="h-4 w-4 text-[#E8AC45] mx-auto mb-1.5 fill-[#E8AC45]" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Total Stars</span>
          <div className="text-xl font-bold text-[#E8AC45] font-mono tabular-nums mt-0.5">
            {totalStars} <span className="text-xs text-[#8692A6] font-normal">/ 300</span>
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">Mastery score</span>
        </div>

        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <Zap className="h-4 w-4 text-[#315CE8] mx-auto mb-1.5" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Top Speed</span>
          <div className="text-xl font-bold text-[#192230] font-mono tabular-nums mt-0.5">
            {stats.highestWpm} <span className="text-xs text-[#8692A6] font-normal">WPM</span>
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">Record velocity</span>
        </div>

        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <Target className="h-4 w-4 text-[#117C78] mx-auto mb-1.5" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Avg Accuracy</span>
          <div className="text-xl font-bold text-[#117C78] font-mono tabular-nums mt-0.5">
            {stats.averageAccuracy}%
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">Precision rate</span>
        </div>

        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <Clock className="h-4 w-4 text-[#315CE8] mx-auto mb-1.5" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Practice Time</span>
          <div className="text-xl font-bold text-[#192230] font-mono tabular-nums mt-0.5">
            {formatTime(stats.totalPracticeTimeSeconds)}
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">Time spent</span>
        </div>

        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 text-center shadow-xs">
          <Flame className="h-4 w-4 text-[#E8AC45] mx-auto mb-1.5 fill-[#E8AC45]" />
          <span className="text-[10px] uppercase font-bold text-[#647184]">Day Streak</span>
          <div className="text-xl font-bold text-[#192230] font-mono tabular-nums mt-0.5">
            {stats.streakDays}d
          </div>
          <span className="text-[11px] text-[#647184] mt-0.5 block">Daily consistency</span>
        </div>
      </div>

      {/* 10-Stage Progress Breakdown */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-7 shadow-xs">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#192230]">Stage-by-Stage Breakdown</h2>
          <p className="text-xs text-[#647184] mt-0.5">Track completion across all ten curriculum modules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAGES.map((st) => {
            let stageCompleted = 0;
            let stageStars = 0;
            for (let i = st.levelStart; i <= st.levelEnd; i++) {
              if (levelsProgress[i]?.completed) {
                stageCompleted++;
                stageStars += levelsProgress[i].stars || 0;
              }
            }
            const percentage = Math.round((stageCompleted / 10) * 100);

            return (
              <div
                key={st.id}
                className="rounded-2xl border border-[#E1E7EF] bg-[#F8FAFC] p-4 transition-all hover:border-[#315CE8]/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#192230]">
                      Stage {st.number}: {st.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#192230] tabular-nums">
                    {stageCompleted} / 10 ({percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-[#E1E7EF] overflow-hidden my-2.5">
                  <div
                    className="h-full bg-[#315CE8] transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#647184]">
                  <span>Levels {st.levelStart}–{st.levelEnd}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#E8AC45]">
                    <Star className="h-3 w-3 fill-[#E8AC45]" />
                    <span className="tabular-nums">{stageStars} / 30 stars</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Practice History Log */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#192230]">Recent Activity History</h2>
            <p className="text-xs text-[#647184] mt-0.5">Log of completed assessments and typing tests</p>
          </div>
          <History className="h-5 w-5 text-[#8692A6]" />
        </div>

        {stats.history && stats.history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#192230]">
              <thead className="border-b border-[#E1E7EF] text-[10px] font-bold uppercase text-[#647184] bg-[#F8FAFC]">
                <tr>
                  <th className="py-2.5 px-4 rounded-l-lg">Session</th>
                  <th className="py-2.5 px-4">Speed</th>
                  <th className="py-2.5 px-4">Accuracy</th>
                  <th className="py-2.5 px-4">Mistakes</th>
                  <th className="py-2.5 px-4">Duration</th>
                  <th className="py-2.5 px-4 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E7EF]">
                {stats.history.slice(0, 10).map((h) => (
                  <tr key={h.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#192230]">{h.title}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#315CE8] tabular-nums">{h.wpm} WPM</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#16845B] tabular-nums">{h.accuracy}%</td>
                    <td className="py-3 px-4 text-[#D64550] font-mono tabular-nums">{h.errors}</td>
                    <td className="py-3 px-4 text-[#647184] tabular-nums">{formatTime(h.durationSeconds)}</td>
                    <td className="py-3 px-4 text-[#8692A6]">
                      {new Date(h.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E1E7EF] bg-[#F8FAFC] p-8 text-center text-xs text-[#647184]">
            No completed sessions recorded yet. Start practicing Level 1 or take a Speed Test to begin your history!
          </div>
        )}
      </div>

      {/* Native Sponsored Recommendations */}
      <NativeAd />
    </div>
  );
};
