/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ALL_LEVELS, getLevelById, getNextLevel } from '../data/levels';
import { Level, LevelProgress, UserSettings, UserStats } from '../types/typing';
import { TypingResult } from '../components/TypingArea';
import { AnimatedKeyboardWithHands } from '../components/AnimatedKeyboardWithHands';
import { LevelCompletionModal } from '../components/LevelCompletionModal';
import { SponsorInterstitial } from '../components/SponsorInterstitial';
import {
  calculateWpm,
  calculateAccuracy,
  calculateCpm,
  formatTime,
  assessLevelPassed,
} from '../utils/typingLogic';
import { recordAssessmentResult, saveActiveLevelId } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { getFingerForKey } from '../data/fingerMapping';

interface LessonViewProps {
  levelId: number;
  levelsProgress: Record<number, LevelProgress>;
  settings: UserSettings;
  stats: UserStats;
  onUpdateProgress: (newProgress: Record<number, LevelProgress>, newStats: UserStats) => void;
  onSelectLevel: (levelId: number) => void;
  onExit: () => void;
  onOpen100DiplomaModal?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  levelId,
  levelsProgress,
  settings,
  stats,
  onUpdateProgress,
  onSelectLevel,
  onExit,
  onOpen100DiplomaModal,
}) => {
  const level: Level = getLevelById(levelId) || ALL_LEVELS[0];

  const allExercises = [
    ...level.exercises,
    { ...level.assessment, isAssessment: true },
  ];

  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number>(0);
  const currentExercise = allExercises[activeExerciseIdx] || allExercises[0];
  const isFinalAssessment = activeExerciseIdx === allExercises.length - 1;

  // Typing state
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [physicallyPressedKey, setPhysicallyPressedKey] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);

  // Modals
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isInterstitialOpen, setIsInterstitialOpen] = useState<boolean>(false);
  const [pendingNextLevelId, setPendingNextLevelId] = useState<number | null>(null);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetChars = useRef<string[]>([]);
  targetChars.current = (currentExercise.targetText || '').split('');

  const currentIndex = typedChars.length;
  const activeChar =
    !isCompleted && currentIndex < targetChars.current.length
      ? targetChars.current[currentIndex]
      : '';

  const activeFingerInfo = activeChar ? getFingerForKey(activeChar) : null;

  // Reset exercise state
  const resetExercise = useCallback(() => {
    setTypedChars([]);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setPhysicallyPressedKey('');
    setIsResultModalOpen(false);
    setIsInterstitialOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (containerRef.current) containerRef.current.focus();
  }, []);

  // When level or exercise changes
  useEffect(() => {
    resetExercise();
    saveActiveLevelId(level.id);
  }, [level.id, activeExerciseIdx, resetExercise]);

  // Auto-focus container on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Finish typing logic
  const handleFinish = useCallback(
    (timeExceeded: boolean = false) => {
      setIsCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const duration = Math.max(1, elapsedSeconds || 1);
      let correct = 0;
      typedChars.forEach((ch, idx) => {
        if (idx < targetChars.current.length && ch === targetChars.current[idx]) {
          correct++;
        }
      });

      const finalWpm = calculateWpm(correct, duration);
      const finalCpm = calculateCpm(correct, duration);
      const finalAccuracy = calculateAccuracy(correct, totalKeystrokes);

      const res: TypingResult = {
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: finalAccuracy,
        elapsedSeconds: duration,
        errors: errorCount,
        totalKeystrokes: Math.max(totalKeystrokes, correct + errorCount),
        correctChars: correct,
        timeLimitExceeded: timeExceeded,
      };

      setLastResult(res);

      const evalResult = assessLevelPassed(
        finalAccuracy,
        finalWpm,
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
          finalWpm,
          finalAccuracy,
          finalCpm,
          evalResult.passed,
          evalResult.stars,
          duration,
          res.totalKeystrokes,
          correct,
          errorCount
        );
        onUpdateProgress(progress, updatedStats);

        if (level.id === 100 && evalResult.passed && onOpen100DiplomaModal) {
          setTimeout(() => {
            onOpen100DiplomaModal();
          }, 1200);
        }
      }

      setIsResultModalOpen(true);
    },
    [
      elapsedSeconds,
      typedChars,
      totalKeystrokes,
      errorCount,
      level.minAccuracy,
      level.targetWpm,
      level.id,
      isFinalAssessment,
      onUpdateProgress,
      onOpen100DiplomaModal,
    ]
  );

  // Timer interval
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = Math.max(1, Math.round((now - startTime) / 1000));
        setElapsedSeconds(secs);

        if (level.timeLimitSeconds && secs >= level.timeLimitSeconds) {
          handleFinish(true);
        }
      }, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, level.timeLimitSeconds, handleFinish]);

  // Global window keydown listener for seamless physical typing anywhere on screen
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isResultModalOpen || isInterstitialOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }

      if (isCompleted) return;

      // Ignore modifier keys alone
      if (['Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      // Prevent page scrolling on Space or browser navigation on Backspace
      if (e.key === ' ' || e.key === 'Backspace' || e.code === 'Space') {
        e.preventDefault();
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        setPhysicallyPressedKey('Backspace');
        setTimeout(() => setPhysicallyPressedKey(''), 100);
        if (typedChars.length > 0) {
          setTypedChars((prev) => prev.slice(0, -1));
          if (soundEnabled) soundEngine.playKeyClick();
        }
        return;
      }

      if (e.key.length === 1) {
        if (!startTime) {
          setStartTime(Date.now());
        }

        setPhysicallyPressedKey(e.key);
        setTimeout(() => setPhysicallyPressedKey(''), 100);

        const expectedChar = targetChars.current[typedChars.length];
        const isCorrect = e.key === expectedChar;

        setTotalKeystrokes((prev) => prev + 1);

        if (isCorrect) {
          if (soundEnabled) soundEngine.playKeyClick();
        } else {
          setErrorCount((prev) => prev + 1);
          if (soundEnabled) soundEngine.playErrorBuzz();
        }

        const nextTyped = [...typedChars, e.key];
        setTypedChars(nextTyped);

        // Check if text is finished
        if (nextTyped.length >= targetChars.current.length) {
          setTimeout(() => handleFinish(false), 50);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isResultModalOpen,
    isInterstitialOpen,
    isCompleted,
    typedChars,
    startTime,
    soundEnabled,
    handleFinish,
    onExit,
  ]);

  // Next exercise within current level
  const handleNextExercise = () => {
    setIsResultModalOpen(false);
    if (activeExerciseIdx < allExercises.length - 1) {
      setActiveExerciseIdx((prev) => prev + 1);
    }
  };

  // Next level handler: Triggers the Sponsor Interstitial (Link 2) before advancing
  const nextLevel = getNextLevel(level.id);
  const isNextLevelUnlocked = nextLevel ? levelsProgress[nextLevel.id]?.unlocked : false;

  const handleNextLevelClick = () => {
    setIsResultModalOpen(false);
    if (nextLevel) {
      setPendingNextLevelId(nextLevel.id);
      setIsInterstitialOpen(true);
    }
  };

  // When interstitial 5-second countdown finishes and user continues
  const handleContinueAfterInterstitial = () => {
    setIsInterstitialOpen(false);
    if (pendingNextLevelId) {
      onSelectLevel(pendingNextLevelId);
      setPendingNextLevelId(null);
    }
  };

  // Live metrics calculation
  let correctCount = 0;
  typedChars.forEach((ch, idx) => {
    if (ch === targetChars.current[idx]) correctCount++;
  });
  const liveWpm = calculateWpm(correctCount, elapsedSeconds);
  const liveAccuracy = calculateAccuracy(correctCount, totalKeystrokes);
  const remainingTime = level.timeLimitSeconds
    ? Math.max(0, level.timeLimitSeconds - elapsedSeconds)
    : elapsedSeconds;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="h-[100dvh] w-full flex flex-col justify-between bg-[#F5F7FA] text-[#192230] select-none outline-none overflow-hidden font-sans border-box"
    >
      {/* ---------------- 1. DISCREET MINIMAL TOP BAR ---------------- */}
      <header className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-2.5 pb-2 flex items-center justify-between border-b border-[#E1E7EF] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="rounded-lg bg-[#EEF3FF] border border-[#315CE8]/30 px-2.5 py-1 text-xs font-bold text-[#315CE8] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#315CE8] animate-pulse"></span>
            <span>Level {level.id}: {level.title}</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#647184] bg-white border border-[#E1E7EF] px-2 py-0.5 rounded-md">
            {isFinalAssessment ? (
              <>
                <Trophy className="h-3 w-3 text-amber-500" />
                <span>Final Assessment</span>
              </>
            ) : (
              <>
                <BookOpen className="h-3 w-3 text-[#315CE8]" />
                <span>Part {activeExerciseIdx + 1} of {allExercises.length}</span>
              </>
            )}
          </span>
        </div>

        {/* Live Metrics: Subtle, uncrowded */}
        <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[#8692A6] text-[10px] uppercase font-bold">WPM</span>
            <span className="text-sm sm:text-base font-bold text-[#192230]">{liveWpm}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#8692A6] text-[10px] uppercase font-bold">ACC</span>
            <span
              className={`text-sm sm:text-base font-bold ${
                liveAccuracy >= level.minAccuracy ? 'text-[#16845B]' : 'text-amber-600'
              }`}
            >
              {liveAccuracy}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#8692A6] text-[10px] uppercase font-bold">TIME</span>
            <span className="text-sm sm:text-base font-bold text-[#315CE8]">
              {formatTime(remainingTime)}
            </span>
          </div>
        </div>

        {/* Discreet Exit & Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={resetExercise}
            title="Restart exercise"
            className="p-1.5 rounded-lg border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'Mute typing sounds' : 'Enable typing sounds'}
            className="p-1.5 rounded-lg border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-[#16845B]" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onExit}
            title="Exit Lesson (Esc)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#D64550] hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer ml-1"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Esc</span>
          </button>
        </div>
      </header>

      {/* ---------------- 2. LARGE CLEAN TARGET TYPING TEXT (TOP AREA) ---------------- */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 max-w-4xl mx-auto w-full overflow-hidden my-auto py-2">
        <div
          ref={textScrollRef}
          className="w-full max-h-[140px] sm:max-h-[170px] overflow-y-auto no-scrollbar scroll-smooth flex flex-wrap items-center justify-center gap-x-0 leading-relaxed font-mono text-xl sm:text-2xl md:text-3xl text-center tracking-wide"
        >
          {targetChars.current.map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex && !isCompleted;
            const typedVal = typedChars[index];
            const isCorrect = isTyped && typedVal === char;
            const isWrong = isTyped && typedVal !== char;

            let charColor = 'text-[#8692A6]'; // default untyped
            let bgClass = '';

            if (isCorrect) {
              charColor = 'text-[#16845B] font-semibold';
            } else if (isWrong) {
              charColor = 'text-white bg-[#D64550] rounded-xs font-bold';
            } else if (isCurrent) {
              charColor = 'text-[#192230] font-bold';
              bgClass = 'border-b-2 border-[#315CE8] animate-pulse';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharSpanRef : undefined}
                className={`relative inline-block transition-colors duration-75 px-[1.5px] ${charColor} ${bgClass}`}
              >
                {char === ' ' ? '\u00A0' : char}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-[#315CE8] rounded-full animate-blink shadow-[0_0_6px_#315CE8]" />
                )}
              </span>
            );
          })}
        </div>

        {/* Subtle Next Key Guidance Hint */}
        <div className="mt-3 flex items-center gap-2 text-xs text-[#647184]">
          <span>Next key:</span>
          <span className="px-2 py-0.5 rounded-md bg-white border border-[#E1E7EF] font-mono font-bold text-[#315CE8] shadow-2xs">
            {activeChar === ' ' ? 'Spacebar' : activeChar || 'Complete'}
          </span>
          {activeFingerInfo && (
            <>
              <span className="text-[#CBD5E1]">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className="h-2 w-2 rounded-full inline-block"
                  style={{ backgroundColor: activeFingerInfo.colorHex }}
                />
                <span>{activeFingerInfo.name}</span>
              </span>
            </>
          )}
        </div>
      </main>

      {/* ---------------- 3. VIRTUAL KEYBOARD WITH ANIMATED HANDS (BOTTOM AREA) ---------------- */}
      <footer className="w-full max-w-4xl mx-auto px-2 sm:px-4 pb-3 sm:pb-5 shrink-0 flex justify-center">
        <div className="w-full max-h-[44vh] flex items-center justify-center">
          <AnimatedKeyboardWithHands
            activeChar={activeChar}
            physicallyPressedKey={physicallyPressedKey}
            showHands={true}
            showFingerColors={true}
            theme="light"
          />
        </div>
      </footer>

      {/* ---------------- 4. COMPLETION RESULTS MODAL ---------------- */}
      <LevelCompletionModal
        isOpen={isResultModalOpen}
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
        onNextLevel={handleNextLevelClick}
        onRetry={resetExercise}
        onClose={() => {
          setIsResultModalOpen(false);
          onExit();
        }}
      />

      {/* ---------------- 5. SPONSOR INTERSTITIAL (LINK 2) ---------------- */}
      <SponsorInterstitial
        isOpen={isInterstitialOpen}
        nextChallengeTitle={nextLevel ? `Level ${nextLevel.id}: ${nextLevel.title}` : undefined}
        onContinue={handleContinueAfterInterstitial}
      />
    </div>
  );
};
