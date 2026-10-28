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
  Maximize2,
  Minimize2,
  Trophy,
  Award,
  ChevronRight,
  Hand,
  CheckCircle,
  AlertCircle,
  Clock,
  Gauge,
} from 'lucide-react';
import { AnimatedKeyboardWithHands } from './AnimatedKeyboardWithHands';
import { calculateWpm, calculateAccuracy, calculateCpm, formatTime, assessLevelPassed } from '../utils/typingLogic';
import { soundEngine } from '../utils/audio';
import { TypingResult } from './TypingArea';
import { SponsorInterstitial } from './SponsorInterstitial';

interface FocusTypingSessionProps {
  title: string;
  subtitle?: string;
  targetText: string;
  timeLimitSeconds?: number;
  targetWpm?: number;
  minAccuracy?: number;
  isAssessment?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onExit: () => void;
  onComplete: (result: TypingResult) => void;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
  nextLevelTitle?: string;
}

export const FocusTypingSession: React.FC<FocusTypingSessionProps> = ({
  title,
  subtitle,
  targetText,
  timeLimitSeconds,
  targetWpm = 25,
  minAccuracy = 90,
  isAssessment = false,
  soundEnabled = true,
  onToggleSound,
  onExit,
  onComplete,
  onNextLevel,
  hasNextLevel = false,
  nextLevelTitle,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [physicallyPressedKey, setPhysicallyPressedKey] = useState<string>('');
  const [errorKey, setErrorKey] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<TypingResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHands, setShowHands] = useState<boolean>(true);
  const [isInterstitialOpen, setIsInterstitialOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetChars = useRef<string[]>([]);
  targetChars.current = targetText.split('');

  const currentIndex = typedChars.length;
  const activeChar = !isCompleted && currentIndex < targetChars.current.length ? targetChars.current[currentIndex] : '';

  // Auto-focus container so physical typing works immediately
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Try requesting Fullscreen API on mount (fallback gracefully if not allowed)
  useEffect(() => {
    const el = document.documentElement;
    if (el && el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {
        // Fallback: full-viewport CSS layout will handle it
      });
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle ESC key to exit
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        onExit();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onExit]);

  // Keep active typed character smoothly centered in view
  useEffect(() => {
    if (activeCharSpanRef.current && textScrollRef.current) {
      const span = activeCharSpanRef.current;
      const scrollBox = textScrollRef.current;
      const spanTop = span.offsetTop;
      const targetScroll = Math.max(0, spanTop - scrollBox.clientHeight / 2 + span.clientHeight / 2);
      scrollBox.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [currentIndex]);

  // Timer interval
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = Math.max(1, Math.round((now - startTime) / 1000));
        setElapsedSeconds(secs);

        if (timeLimitSeconds && secs >= timeLimitSeconds) {
          handleFinish(true);
        }
      }, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, timeLimitSeconds]);

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
      };

      setFinalResult(res);
      onComplete(res);

      const evalPass = assessLevelPassed(finalAccuracy, finalWpm, minAccuracy, targetWpm);
      if (evalPass.passed) {
        soundEngine.playSuccessFanfare();
      }
    },
    [elapsedSeconds, typedChars, totalKeystrokes, errorCount, minAccuracy, targetWpm, onComplete]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isCompleted) return;

    // Ignore system modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      setPhysicallyPressedKey('Backspace');
      setTimeout(() => setPhysicallyPressedKey(''), 100);
      if (typedChars.length > 0) {
        setTypedChars((prev) => prev.slice(0, -1));
        soundEngine.playKeyClick();
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();

      // Start timer on first keystroke
      if (!startTime) {
        setStartTime(Date.now());
      }

      setPhysicallyPressedKey(e.key);
      setTimeout(() => setPhysicallyPressedKey(''), 100);

      const expectedChar = targetChars.current[typedChars.length];
      const isCorrect = e.key === expectedChar;

      setTotalKeystrokes((prev) => prev + 1);

      if (isCorrect) {
        soundEngine.playKeyClick();
      } else {
        setErrorCount((prev) => prev + 1);
        setErrorKey(e.key);
        setTimeout(() => setErrorKey(''), 220);
        soundEngine.playErrorBuzz();
      }

      const nextTyped = [...typedChars, e.key];
      setTypedChars(nextTyped);

      // Check if finished
      if (nextTyped.length >= targetChars.current.length) {
        setTimeout(() => handleFinish(false), 50);
      }
    }
  };

  const handleRestart = () => {
    setTypedChars([]);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setFinalResult(null);
    setPhysicallyPressedKey('');
    if (containerRef.current) containerRef.current.focus();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Live metrics calculation
  let correctCount = 0;
  typedChars.forEach((ch, idx) => {
    if (ch === targetChars.current[idx]) correctCount++;
  });
  const liveWpm = calculateWpm(correctCount, elapsedSeconds);
  const liveAccuracy = calculateAccuracy(correctCount, totalKeystrokes);
  const remainingTime = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsedSeconds) : elapsedSeconds;

  const assessmentEval = finalResult
    ? assessLevelPassed(finalResult.accuracy, finalResult.wpm, minAccuracy, targetWpm)
    : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0B0F17] text-[#E2E8F0] select-none outline-none overflow-hidden font-sans"
    >
      {/* ---------------- 1. MINIMAL UNOBTRUSIVE TOP HUD ---------------- */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {title}
          </span>
          {subtitle && (
            <span className="hidden md:inline text-xs text-slate-400 border-l border-slate-700 pl-3">
              {subtitle}
            </span>
          )}
        </div>

        {/* Live Metrics Counters */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">WPM</span>
            <span className="text-base font-bold text-white">{liveWpm}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">ACC</span>
            <span
              className={`text-base font-bold ${
                liveAccuracy >= minAccuracy ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {liveAccuracy}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">TIME</span>
            <span className="text-base font-bold text-sky-400">{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Right Controls: Restart, Hands Toggle, Sound, Fullscreen, Exit */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestart}
            title="Restart session (or type again)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHands((prev) => !prev)}
            title="Toggle animated hands guide"
            className={`p-1.5 rounded-lg border border-slate-800 text-xs transition-colors cursor-pointer ${
              showHands
                ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Hand className="h-4 w-4" />
          </button>

          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onExit}
            title="Exit Focus Mode (ESC)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors cursor-pointer ml-1"
          >
            <X className="h-3.5 w-3.5" />
            <span>Esc</span>
          </button>
        </div>
      </header>

      {/* ---------------- 2. LARGE CLEAN CENTERED TYPING TEXT (TOP) ---------------- */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 max-w-5xl mx-auto w-full overflow-hidden">
        <div
          ref={textScrollRef}
          className="w-full max-h-[180px] sm:max-h-[220px] overflow-y-auto no-scrollbar scroll-smooth flex flex-wrap items-center justify-center gap-x-0 leading-relaxed font-mono text-xl sm:text-2xl md:text-3xl text-center tracking-wide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {targetChars.current.map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex && !isCompleted;
            const typedVal = typedChars[index];
            const isCorrect = isTyped && typedVal === char;
            const isWrong = isTyped && typedVal !== char;

            let charColor = 'text-slate-500';
            let bgClass = '';

            if (isCorrect) {
              charColor = 'text-emerald-400 font-semibold';
            } else if (isWrong) {
              charColor = 'text-white bg-rose-600/90 rounded-xs font-bold';
            } else if (isCurrent) {
              charColor = 'text-white font-bold';
              bgClass = 'border-b-2 border-sky-400 animate-pulse';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharSpanRef : undefined}
                className={`relative inline-block transition-colors duration-75 px-[1.5px] ${charColor} ${bgClass}`}
              >
                {char === ' ' ? '\u00A0' : char}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2.5px] bg-sky-400 rounded-full animate-blink shadow-[0_0_8px_#38bdf8]" />
                )}
              </span>
            );
          })}
        </div>

        {/* Subtle Next Key Hint */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span>Next key:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono font-bold text-sky-300">
            {activeChar === ' ' ? 'Spacebar' : activeChar || 'Complete'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Press Esc anytime to return</span>
        </div>
      </main>

      {/* ---------------- 3. VIRTUAL KEYBOARD WITH ANIMATED HANDS (BOTTOM) ---------------- */}
      <footer className="w-full max-w-5xl mx-auto px-2 sm:px-4 pb-4 sm:pb-6">
        <AnimatedKeyboardWithHands
          activeChar={activeChar}
          physicallyPressedKey={physicallyPressedKey}
          errorKey={errorKey}
          showHands={showHands}
          showFingerColors={true}
          theme="dark"
        />
      </footer>

      {/* ---------------- 4. MODAL: SESSION COMPLETION OVERLAY ---------------- */}
      {isCompleted && finalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8 text-center shadow-2xl">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 shadow-lg">
              <Trophy className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              {assessmentEval?.passed ? 'Session Complete!' : 'Good Effort! Keep Going'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">{assessmentEval?.message}</p>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Speed</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {finalResult.wpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  {finalResult.accuracy}%
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Mistakes</span>
                <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">
                  {finalResult.errors}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry</span>
              </button>

              {hasNextLevel && onNextLevel ? (
                <button
                  type="button"
                  onClick={() => setIsInterstitialOpen(true)}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors cursor-pointer"
                >
                  <span>Next Challenge</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExit}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors cursor-pointer"
                >
                  <span>Return (Esc)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Interstitial (Link 2) */}
      <SponsorInterstitial
        isOpen={isInterstitialOpen}
        nextChallengeTitle={nextLevelTitle}
        onContinue={() => {
          setIsInterstitialOpen(false);
          if (onNextLevel) onNextLevel();
        }}
      />
    </div>
  );
};
