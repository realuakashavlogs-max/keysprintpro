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
  Maximize2,
} from 'lucide-react';
import { ALL_LEVELS, getLevelById, getNextLevel, getPreviousLevel } from '../data/levels';
import { STAGES } from '../data/stages';
import { Level, LevelProgress, UserSettings, UserStats } from '../types/typing';
import { TypingArea, TypingResult } from '../components/TypingArea';
import { AnimatedKeyboardWithHands } from '../components/AnimatedKeyboardWithHands';
import { HandGuide } from '../components/HandGuide';
import { FocusTypingSession } from '../components/FocusTypingSession';
import { LevelCompletionModal } from '../components/LevelCompletionModal';
import { assessLevelPassed } from '../utils/typingLogic';
import { recordAssessmentResult, saveActiveLevelId } from '../utils/storage';
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
  const [isFocusModeOpen, setIsFocusModeOpen] = useState<boolean>(false);

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
    if (allExercises[0]?.targetText) {
      setActiveChar(allExercises[0].targetText[0] || 'f');
    }
  }, [level.id]);

  useEffect(() => {
    if (currentExercise?.targetText) {
      setActiveChar(currentExercise.targetText[0] || 'f');
    }
  }, [activeExerciseIdx]);

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
    <div className="flex flex-col gap-3 pb-8 max-w-4xl mx-auto">
      {/* Sleek Minimalist Lesson Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#E1E7EF] bg-white px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#EEF3FF] border border-[#315CE8]/20 px-2.5 py-1 text-xs font-bold text-[#315CE8]">
            Level {level.id}: {level.title}
          </span>
          {currentProgress.completed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#16845B] border border-emerald-200">
              <CheckCircle className="h-3 w-3" /> Passed
            </span>
          )}
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              disabled={!prevLevel}
              onClick={() => prevLevel && onSelectLevel(prevLevel.id)}
              aria-label="Previous level"
              className="flex items-center gap-1 rounded-lg border border-[#E1E7EF] bg-white px-2 py-1 text-xs font-semibold text-[#647184] hover:text-[#192230] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <button
              type="button"
              disabled={!nextLevel || !isNextLevelUnlocked}
              onClick={() => nextLevel && isNextLevelUnlocked && onSelectLevel(nextLevel.id)}
              aria-label="Next level"
              className="flex items-center gap-1 rounded-lg border border-[#E1E7EF] bg-white px-2 py-1 text-xs font-semibold text-[#647184] hover:text-[#192230] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Practice Parts Tabs & Focus Mode Button */}
        <div className="flex flex-wrap items-center gap-1.5">
          {allExercises.map((ex, idx) => {
            const isAssessment = idx === allExercises.length - 1;
            const isActive = idx === activeExerciseIdx;

            return (
              <button
                key={ex.id || idx}
                type="button"
                onClick={() => setActiveExerciseIdx(idx)}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
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

          <button
            type="button"
            onClick={() => setIsFocusModeOpen(true)}
            title="Enter Fullscreen Focus Mode"
            className="flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#1E293B] transition-all cursor-pointer ml-1"
          >
            <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
            <span>Focus Mode</span>
          </button>
        </div>
      </div>

      {/* 1. TOP: Vector Hand-Placement Guide */}
      <HandGuide activeChar={activeChar} />

      {/* 2. CENTER: Prominent Target Typing Area with Live HUD */}
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

      {/* 3. BOTTOM: Clearly Visible Interactive Virtual Keyboard with Animated Hands */}
      <div className="w-full pt-1">
        <AnimatedKeyboardWithHands
          activeChar={activeChar}
          physicallyPressedKey={physicallyPressedKey}
          showHands={true}
          showFingerColors={true}
          theme="light"
        />
      </div>

      {/* Fullscreen Immersive Focus Mode Session */}
      {isFocusModeOpen && (
        <FocusTypingSession
          title={`Level ${level.id}: ${level.title}`}
          subtitle={`Part ${activeExerciseIdx + 1} of ${allExercises.length} • Target: ${level.targetWpm} WPM`}
          targetText={currentExercise.targetText}
          targetWpm={level.targetWpm}
          minAccuracy={level.minAccuracy}
          isAssessment={isFinalAssessment}
          soundEnabled={settings.soundEnabled}
          onExit={() => setIsFocusModeOpen(false)}
          onComplete={(res) => {
            handleComplete(res);
          }}
          onNextLevel={() => {
            setIsFocusModeOpen(false);
            handleNextLevel();
          }}
          hasNextLevel={level.id < 100 && isNextLevelUnlocked}
          nextLevelTitle={nextLevel?.title}
        />
      )}

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
