/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Zap, Target, AlertCircle, Clock } from 'lucide-react';
import { calculateAccuracy, calculateCpm, calculateWpm, formatTime } from '../utils/typingLogic';
import { soundEngine } from '../utils/audio';

export interface TypingResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  elapsedSeconds: number;
  totalKeystrokes: number;
  correctChars: number;
  errors: number;
  timeLimitExceeded?: boolean;
}

interface TypingAreaProps {
  targetText: string;
  isAssessment?: boolean;
  minAccuracy?: number;
  targetWpm?: number;
  timeLimitSeconds?: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: 'mono' | 'sans';
  blindMode?: boolean;
  onCharacterTyped?: (char: string, physicalKey: string) => void;
  onComplete: (result: TypingResult) => void;
  onReset?: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  isAssessment = false,
  minAccuracy = 90,
  targetWpm = 20,
  timeLimitSeconds,
  fontSize = 'lg',
  fontFamily = 'mono',
  blindMode = false,
  onCharacterTyped,
  onComplete,
  onReset,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [lastPhysicalKey, setLastPhysicalKey] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetChars = useRef<string[]>([]);

  useEffect(() => {
    targetChars.current = targetText.split('');
    setTypedChars([]);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setLastPhysicalKey('');

    if (onCharacterTyped && targetText.length > 0) {
      onCharacterTyped(targetText[0], '');
    }

    if (containerRef.current) {
      containerRef.current.focus({ preventScroll: true });
    }
  }, [targetText]);

  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = Math.max(1, Math.round((now - startTime) / 1000));
        setElapsedSeconds(secs);

        if (timeLimitSeconds && secs >= timeLimitSeconds) {
          finishTyping(true);
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, timeLimitSeconds]);

  const finishTyping = useCallback(
    (timeLimitExceeded: boolean = false) => {
      setIsCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const duration = Math.max(1, elapsedSeconds || 1);
      let correct = 0;
      typedChars.forEach((char, idx) => {
        if (idx < targetChars.current.length && char === targetChars.current[idx]) {
          correct++;
        }
      });

      const finalWpm = calculateWpm(correct, duration);
      const finalCpm = calculateCpm(correct, duration);
      const finalAccuracy = calculateAccuracy(correct, totalKeystrokes);

      onComplete({
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: finalAccuracy,
        elapsedSeconds: duration,
        totalKeystrokes,
        correctChars: correct,
        errors: errorCount,
        timeLimitExceeded,
      });
    },
    [elapsedSeconds, typedChars, totalKeystrokes, errorCount, onComplete]
  );

  useEffect(() => {
    if (
      typedChars.length > 0 &&
      typedChars.length >= targetChars.current.length &&
      !isCompleted
    ) {
      finishTyping(false);
    }
  }, [typedChars, isCompleted, finishTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (['Space', 'Backspace', 'Tab'].includes(e.code) || e.key === ' ') {
      e.preventDefault();
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    if (isCompleted) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setLastPhysicalKey(e.key);

    const currentIndex = typedChars.length;
    const expectedChar = targetChars.current[currentIndex];

    if (e.key === 'Backspace') {
      if (currentIndex > 0) {
        soundEngine.playKeyClick();
        const updated = typedChars.slice(0, currentIndex - 1);
        setTypedChars(updated);

        const prevExpected = targetChars.current[currentIndex - 1];
        if (onCharacterTyped) {
          onCharacterTyped(prevExpected || '', e.key);
        }
      }
      return;
    }

    if (e.key.length === 1) {
      setTotalKeystrokes((prev) => prev + 1);
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        soundEngine.playKeyClick();
      } else {
        soundEngine.playError();
        setErrorCount((prev) => prev + 1);
      }

      const nextTyped = [...typedChars, e.key];
      setTypedChars(nextTyped);

      const nextExpected = targetChars.current[nextTyped.length];
      if (onCharacterTyped) {
        onCharacterTyped(nextExpected || '', e.key);
      }
    }
  };

  const handleReset = () => {
    setTypedChars([]);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setLastPhysicalKey('');

    if (onCharacterTyped && targetText.length > 0) {
      onCharacterTyped(targetText[0], '');
    }
    if (onReset) onReset();
    if (containerRef.current) containerRef.current.focus({ preventScroll: true });
  };

  let correctCount = 0;
  typedChars.forEach((ch, idx) => {
    if (ch === targetChars.current[idx]) correctCount++;
  });
  const liveWpm = calculateWpm(correctCount, elapsedSeconds);
  const liveAccuracy = calculateAccuracy(correctCount, totalKeystrokes);
  const progressPercent = Math.min(
    100,
    Math.round((typedChars.length / (targetChars.current.length || 1)) * 100)
  );

  const timeRemaining = timeLimitSeconds
    ? Math.max(0, timeLimitSeconds - elapsedSeconds)
    : elapsedSeconds;

  const fontSizeClass = {
    sm: 'text-base sm:text-lg leading-relaxed',
    md: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-xl sm:text-2xl leading-relaxed tracking-wide',
    xl: 'text-2xl sm:text-3xl leading-loose tracking-wider',
  }[fontSize];

  const fontFamClass = fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Live HUD Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 rounded-2xl border border-[#E1E7EF] bg-white p-3 text-xs shadow-xs">
        {/* WPM */}
        <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 border border-[#E1E7EF]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#315CE8]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#647184] uppercase tracking-wider font-semibold">
              Live WPM
            </div>
            <div className="text-base sm:text-lg font-bold text-[#192230] font-mono leading-none mt-0.5">
              {liveWpm} <span className="text-[10px] text-[#8692A6] font-normal">/ {targetWpm}</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 border border-[#E1E7EF]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#16845B]">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#647184] uppercase tracking-wider font-semibold">
              Accuracy
            </div>
            <div className="text-base sm:text-lg font-bold text-[#192230] font-mono leading-none mt-0.5">
              {liveAccuracy}%{' '}
              <span className="text-[10px] text-[#8692A6] font-normal">min {minAccuracy}%</span>
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 border border-[#E1E7EF]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-[#D64550]">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#647184] uppercase tracking-wider font-semibold">
              Mistakes
            </div>
            <div className="text-base sm:text-lg font-bold text-[#D64550] font-mono leading-none mt-0.5">
              {errorCount}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] p-2.5 border border-[#E1E7EF]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#315CE8]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#647184] uppercase tracking-wider font-semibold">
              {timeLimitSeconds ? 'Time Left' : 'Elapsed'}
            </div>
            <div className="text-base sm:text-lg font-bold text-[#192230] font-mono leading-none mt-0.5">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-[#E1E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#192230] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#647184]" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E1E7EF]">
        <div
          className="h-full bg-[#315CE8] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Text Display Canvas */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative cursor-text rounded-2xl border bg-white p-6 sm:p-8 shadow-xs transition-all outline-none select-none min-h-[160px] sm:min-h-[180px] flex items-center ${
          isFocused
            ? 'border-[#315CE8] ring-3 ring-[#315CE8]/15'
            : 'border-[#E1E7EF] hover:border-slate-300'
        }`}
      >
        {!isFocused && !isCompleted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-[1px]">
            <div className="rounded-xl border border-[#315CE8]/30 bg-[#EEF3FF] px-4 py-2 text-center text-xs sm:text-sm font-semibold text-[#315CE8] shadow-xs">
              Click here or press any key to focus and type
            </div>
          </div>
        )}

        {/* Character Diff Rendering */}
        <div className={`w-full ${fontSizeClass} ${fontFamClass} text-left break-words`}>
          {targetChars.current.map((char, index) => {
            const isTyped = index < typedChars.length;
            const isCurrent = index === typedChars.length;
            const typedChar = isTyped ? typedChars[index] : null;
            const isMatch = typedChar === char;

            let charClass = 'text-[#8692A6]'; // Default untyped
            if (isTyped) {
              if (isMatch) {
                charClass = 'text-[#16845B] font-semibold';
              } else {
                charClass = 'text-[#D64550] bg-rose-50 border-b-2 border-[#D64550] rounded-xs px-0.5';
              }
            } else if (isCurrent) {
              charClass = 'text-[#192230] font-bold bg-[#EEF3FF] border-b-2 border-[#315CE8] ring-2 ring-[#315CE8]/30 rounded-xs px-0.5 animate-pulse';
            }

            const displayChar = char === ' ' ? ' ' : char;

            return (
              <span key={index} className={`relative transition-colors duration-75 ${charClass}`}>
                {displayChar}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
