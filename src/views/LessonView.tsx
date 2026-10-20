/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { ALL_LEVELS, getLevelById, getNextLevel, getPreviousLevel } from '../data/levels';
import { STAGES } from '../data/stages';
import { Level, LevelProgress, UserSettings, UserStats } from '../types/typing';
import { TypingArea, TypingResult } from '../components/TypingArea';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { HandGuide } from '../components/HandGuide';
import { LevelCompletionModal } from '../components/LevelCompletionModal';
import { assessLevelPassed } from '../utils/typingLogic';
import { recordAssessmentResult, saveActiveLevelId } from '../utils/storage';
import { ResponsiveAdLeaderboard } from '../components/AdBanner';
import { soundEngine } from '../utils/audio';

interface LessonViewProps {
  levelId: number;
  levelsProgress: Record<number, LevelProgress>;
  settings: UserSettings;
  stats: UserStats;
  onUpdateProgress: (newProgress: Record<number, LevelProgress>, newStats: UserStats) => void;
  onSelectLevel: (levelId: number) => void;
  onOpen100DiplomaModal?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  levelId,
  levelsProgress,
  settings,
  stats,
  onUpdateProgress,
  onSelectLevel,
  onOpen100DiplomaModal,
}) => {
  const level: Level = getLevelById(levelId) || ALL_LEVELS[0];
  const stage = STAGES.find((s) => s.id === level.stageId) || STAGES[0];
  const currentProgress = levelsProgress[levelId] || {
    levelId,
    completed: false,
    unlocked: true,
    stars: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    bestCpm: 0,
    attempts: 0,
  };

  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number>(0);
  const [activeChar, setActiveChar] = useState<string>('');
  const [physicallyPressedKey, setPhysicallyPressedKey] = useState<string>('');
  const [showPostureDetails, setShowPostureDetails] = useState<boolean>(level.id === 1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<TypingResult>({
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    elapsedSeconds: 0,
    totalKeystrokes: 0,
    correctChars: 0,
    errors: 0,
  });
  const [passedAssessment, setPassedAssessment] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [coachFeedback, setCoachFeedback] = useState<string>('');

  const allExercises = [
    ...level.exercises,
    { ...level.assessment, isAssessment: true },
  ];

  const currentExercise = allExercises[activeExerciseIdx] || allExercises[0];
  const isFinalAssessment = activeExerciseIdx === allExercises.length - 1;

  useEffect(() => {
    setActiveExerciseIdx(0);
    setIsModalOpen(false);
    setShowPostureDetails(level.id === 1);
    saveActiveLevelId(level.id);
  }, [level.id]);

  const handleCharacterTyped = (char: string, physicalKey: string) => {
    setActiveChar(char);
    setPhysicallyPressedKey(physicalKey);
  };

  const handleComplete = (res: TypingResult) => {
    setLastResult(res);

    const evalResult = assessLevelPassed(
      res.accuracy,
      res.wpm,
      level.minAccuracy,
      level.targetWpm
    );

    setPassedAssessment(evalResult.passed);
    setEarnedStars(evalResult.stars);
    setCoachFeedback(evalResult.message);

    if (evalResult.passed) {
      soundEngine.playSuccessFanfare();
    }

    if (isFinalAssessment) {
      const { progress, stats: updatedStats } = recordAssessmentResult(
        level.id,
        res.wpm,
        res.accuracy,
        res.cpm,
        evalResult.passed,
        evalResult.stars,
        res.elapsedSeconds,
        res.totalKeystrokes,
        res.correctChars,
        res.errors
      );
      onUpdateProgress(progress, updatedStats);

      if (level.id === 100 && evalResult.passed && onOpen100DiplomaModal) {
        setTimeout(() => {
          onOpen100DiplomaModal();
        }, 1200);
      }
    }

    setIsModalOpen(true);
  };

  const handleNextExercise = () => {
    setIsModalOpen(false);
    if (activeExerciseIdx < allExercises.length - 1) {
      setActiveExerciseIdx((prev) => prev + 1);
    }
  };

  const handleNextLevel = () => {
    setIsModalOpen(false);
    const next = getNextLevel(level.id);
    if (next && levelsProgress[next.id]?.unlocked) {
      onSelectLevel(next.id);
    }
  };

  const handleRetry = () => {
    setIsModalOpen(false);
  };

  const prevLevel = getPreviousLevel(level.id);
  const nextLevel = getNextLevel(level.id);
  const isNextLevelUnlocked = nextLevel ? levelsProgress[nextLevel.id]?.unlocked : false;

  return (
    <div className="flex flex-col gap-4 pb-16 max-w-5xl mx-auto">
      {/* 1. Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E1E7EF] pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#EEF3FF] border border-[#315CE8]/20 px-2.5 py-1 text-xs font-bold text-[#315CE8]">
            Stage {stage.number}: {stage.title}
          </span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-xs sm:text-sm font-bold text-[#192230] font-mono">
            Level {level.id} of 100
          </span>
          {currentProgress.completed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#16845B] border border-emerald-200">
              <CheckCircle className="h-3 w-3" /> Passed
            </span>
          )}
        </div>

        {/* Level Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!prevLevel}
            onClick={() => prevLevel && onSelectLevel(prevLevel.id)}
            aria-label="Previous level"
            className="flex items-center gap-1 rounded-lg border border-[#E1E7EF] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#647184] hover:text-[#192230] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            type="button"
            disabled={!nextLevel || !isNextLevelUnlocked}
            onClick={() => nextLevel && isNextLevelUnlocked && onSelectLevel(nextLevel.id)}
            aria-label="Next level"
            className="flex items-center gap-1 rounded-lg border border-[#E1E7EF] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#647184] hover:text-[#192230] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Level 1 Beginner Welcome Box */}
      {level.id === 1 && (
        <div className="rounded-2xl border border-[#315CE8]/30 bg-[#EEF3FF] p-4 text-xs sm:text-sm text-[#192230] leading-relaxed shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#315CE8] text-white font-bold text-xs mt-0.5">
              1
            </div>
            <div>
              <strong className="text-[#315CE8] font-bold block mb-0.5">
                Welcome to Touch Typing! Place your fingers on the Home Row:
              </strong>
              <span>
                Feel the small raised bumps on keys <strong>F</strong> (left index finger) and{' '}
                <strong>J</strong> (right index finger). Rest your left fingers on <strong>A S D F</strong> and
                your right fingers on <strong>J K L ;</strong>. Keep your eyes on the screen!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Level Objective & Tabs Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#E1E7EF] bg-white p-4 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#192230]">
            {level.title}
          </h1>
          <p className="text-xs text-[#647184] mt-0.5">
            {level.objective}
          </p>
        </div>

        {/* Practice Parts Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {allExercises.map((ex, idx) => {
            const isAssessment = idx === allExercises.length - 1;
            const isActive = idx === activeExerciseIdx;

            return (
              <button
                key={ex.id || idx}
                type="button"
                onClick={() => setActiveExerciseIdx(idx)}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? isAssessment
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-[#315CE8] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E1E7EF] text-[#647184] hover:text-[#192230]'
                }`}
              >
                {isAssessment ? (
                  <>
                    <Trophy className="h-3 w-3" />
                    <span>Assessment</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-3 w-3" />
                    <span>Part {idx + 1}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3. Vector Hand-Placement Guide (PROMINENT AT TOP!) */}
      <HandGuide activeChar={activeChar} />

      {/* 4. Prominent Target Typing Area with Live HUD */}
      <TypingArea
        key={`lesson-${level.id}-${activeExerciseIdx}`}
        targetText={currentExercise.targetText}
        isAssessment={isFinalAssessment}
        minAccuracy={level.minAccuracy}
        targetWpm={level.targetWpm}
        timeLimitSeconds={level.timeLimitSeconds}
        fontSize={settings.fontSize}
        fontFamily={settings.fontFamily}
        blindMode={settings.blindMode}
        onCharacterTyped={handleCharacterTyped}
        onComplete={handleComplete}
      />

      {/* 5. Clearly Visible Interactive Virtual Keyboard */}
      <VirtualKeyboard
        activeChar={activeChar}
        physicallyPressedKey={physicallyPressedKey}
        showFingerColors={true}
      />

      {/* Monetization Leaderboard Banner */}
      <div className="pt-2">
        <ResponsiveAdLeaderboard />
      </div>

      {/* Completion Results Modal */}
      <LevelCompletionModal
        isOpen={isModalOpen}
        levelId={level.id}
        levelTitle={level.title}
        isAssessment={isFinalAssessment}
        exerciseTitle={currentExercise.title}
        minAccuracy={level.minAccuracy}
        targetWpm={level.targetWpm}
        result={lastResult}
        passed={passedAssessment}
        stars={earnedStars}
        coachMessage={coachFeedback}
        hasNextExercise={activeExerciseIdx < allExercises.length - 1}
        hasNextLevel={level.id < 100 && isNextLevelUnlocked}
        onNextExercise={handleNextExercise}
        onNextLevel={handleNextLevel}
        onRetry={handleRetry}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
