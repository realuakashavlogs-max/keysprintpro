/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, AlertTriangle, Zap, Target, Clock, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTime } from '../utils/typingLogic';
import { TypingResult } from './TypingArea';
import { AdBanner, SMARTLINK_URL } from './AdBanner';

interface LevelCompletionModalProps {
  isOpen: boolean;
  levelId: number;
  levelTitle: string;
  isAssessment: boolean;
  exerciseTitle: string;
  minAccuracy: number;
  targetWpm: number;
  result: TypingResult;
  passed: boolean;
  stars: number;
  coachMessage: string;
  hasNextExercise: boolean;
  hasNextLevel: boolean;
  onNextExercise: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({
  isOpen,
  levelId,
  levelTitle,
  isAssessment,
  exerciseTitle,
  minAccuracy,
  targetWpm,
  result,
  passed,
  stars,
  coachMessage,
  hasNextExercise,
  hasNextLevel,
  onNextExercise,
  onNextLevel,
  onRetry,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && passed) {
      try {
        confetti({
          particleCount: stars === 3 ? 90 : 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if confetti fails in headless
      }
    }
  }, [isOpen, passed, stars]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#192230]/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-8 shadow-2xl">
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-3 shadow-xs ${
              passed
                ? 'bg-emerald-50 text-[#16845B] border border-emerald-200'
                : 'bg-amber-50 text-[#E8AC45] border border-amber-200'
            }`}
          >
            {passed ? <Trophy className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#192230] tracking-tight">
            {passed
              ? isAssessment
                ? `Level ${levelId} Passed!`
                : 'Exercise Completed!'
              : 'Keep Practicing!'}
          </h2>
          <p className="text-xs sm:text-sm text-[#647184] mt-0.5">
            {levelTitle} · {exerciseTitle}
          </p>

          {/* Stars display */}
          <div className="flex items-center gap-1.5 my-3">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`h-7 w-7 transition-all ${
                  starIdx <= stars
                    ? 'fill-[#E8AC45] text-[#E8AC45] scale-110 drop-shadow-xs'
                    : 'text-[#E1E7EF]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Coach Message Banner */}
        <div
          className={`rounded-xl p-3 my-3 text-xs sm:text-sm text-center border font-medium ${
            passed
              ? 'bg-emerald-50 border-emerald-200 text-[#16845B]'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {coachMessage}
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          {/* WPM */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
            <Zap className="h-4 w-4 text-[#315CE8] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[#647184]">Speed</span>
            <span className="text-lg sm:text-xl font-bold text-[#192230] font-mono tabular-nums">{result.wpm} <span className="text-xs font-normal">WPM</span></span>
            <span className="text-[10px] text-[#8692A6]">Goal: {targetWpm}</span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
            <Target className="h-4 w-4 text-[#16845B] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[#647184]">Accuracy</span>
            <span className="text-lg sm:text-xl font-bold text-[#16845B] font-mono tabular-nums">{result.accuracy}%</span>
            <span className="text-[10px] text-[#8692A6]">Min: {minAccuracy}%</span>
          </div>

          {/* Errors */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
            <Hash className="h-4 w-4 text-[#D64550] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[#647184]">Mistakes</span>
            <span className="text-lg sm:text-xl font-bold text-[#D64550] font-mono tabular-nums">{result.errors}</span>
            <span className="text-[10px] text-[#8692A6]">{result.totalKeystrokes} keys</span>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
            <Clock className="h-4 w-4 text-[#315CE8] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[#647184]">Duration</span>
            <span className="text-lg sm:text-xl font-bold text-[#192230] font-mono tabular-nums">
              {formatTime(result.elapsedSeconds)}
            </span>
            <span className="text-[10px] text-[#8692A6]">{result.cpm} CPM</span>
          </div>
        </div>

        {/* High-Converting 300x250 Monetization Banner */}
        <div className="my-2 flex justify-center">
          <AdBanner type="300x250" />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col-reverse sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl border border-[#E1E7EF] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#192230] hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="h-4 w-4 text-[#647184]" />
            <span>Practice Again</span>
          </button>

          {passed ? (
            isAssessment && hasNextLevel ? (
              <button
                type="button"
                onClick={onNextLevel}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-[#315CE8] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2546B8] transition-all cursor-pointer"
              >
                <span>Next Level ({levelId + 1})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : hasNextExercise ? (
              <button
                type="button"
                onClick={onNextExercise}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-[#315CE8] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2546B8] transition-all cursor-pointer"
              >
                <span>Next Exercise</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-[#315CE8] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#2546B8] transition-all cursor-pointer shadow-xs"
              >
                <span>Continue</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-[#E8AC45] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#192230] hover:bg-amber-400 transition-all shadow-xs cursor-pointer"
            >
              <span>Retry Assessment</span>
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sponsored Partner Speed Challenge Smartlink */}
        <div className="mt-3 pt-3 border-t border-[#E1E7EF] text-center">
          <a
            href={SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#315CE8] hover:text-[#2546B8] hover:underline"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Bonus: Test Your Speed in Global Sponsored Arena →</span>
          </a>
        </div>
      </div>
    </div>
  );
};
