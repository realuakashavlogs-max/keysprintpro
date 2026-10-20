/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Gauge, Clock, Award, RotateCcw, Zap, Target, ArrowRight } from 'lucide-react';
import { TypingArea, TypingResult } from '../components/TypingArea';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { HandGuide } from '../components/HandGuide';
import { recordPracticeSession } from '../utils/storage';
import { UserSettings, UserStats } from '../types/typing';
import { soundEngine } from '../utils/audio';
import { AdBanner, SMARTLINK_URL } from '../components/AdBanner';

const SPEED_TEST_DURATIONS = [
  { label: '1 Minute', seconds: 60 },
  { label: '3 Minutes', seconds: 180 },
  { label: '5 Minutes', seconds: 300 },
];

const SPEED_TEST_PASSAGES = [
  'The art of writing well and typing swiftly has transformed human progress. When words flow effortlessly from mind to fingertips, ideas travel with light speed across continents, igniting innovation and uniting people around shared knowledge and creative dreams.',
  'Science and literature are complementary forces of the human mind. While scientific inquiry explores the vast architecture of the cosmos, literature illuminates the depths of human feeling, empathy, and our endless search for truth and understanding.',
  'Great accomplishments are built upon consistent daily practice. When you sit before a keyboard with discipline, every keystroke trains your neuromuscular system to operate with greater calm, elegance, and velocity until mastery becomes your natural state.',
  'In the digital era, high-speed touch typing is an essential skill that elevates intellectual work. It frees your cognitive energy from the mechanical act of hunting for keys, allowing you to craft thoughts with total clarity, focus, and expressive brilliance.',
];

interface SpeedTestViewProps {
  settings: UserSettings;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  settings,
  stats,
  onUpdateStats,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [passageIndex, setPassageIndex] = useState<number>(0);
  const [activeChar, setActiveChar] = useState<string>('');
  const [physicalKey, setPhysicalKey] = useState<string>('');
  const [testResult, setTestResult] = useState<TypingResult | null>(null);
  const [testKey, setTestKey] = useState<number>(0);

  const activePassage = SPEED_TEST_PASSAGES[passageIndex % SPEED_TEST_PASSAGES.length];

  const handleComplete = (res: TypingResult) => {
    setTestResult(res);
    soundEngine.playSuccessFanfare();

    const updated = recordPracticeSession(
      'speed_test',
      `Speed Test (${selectedDuration / 60} min)`,
      res.wpm,
      res.cpm,
      res.accuracy,
      res.errors,
      res.elapsedSeconds,
      res.totalKeystrokes,
      res.correctChars
    );
    onUpdateStats(updated);
  };

  const handleRestart = () => {
    setTestResult(null);
    setTestKey((prev) => prev + 1);
  };

  const handleChangePassage = () => {
    setPassageIndex((prev) => prev + 1);
    handleRestart();
  };

  const getTypingTier = (wpm: number) => {
    if (wpm >= 80) return { title: 'Master Typist', color: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (wpm >= 60) return { title: 'Advanced Typist', color: 'text-purple-700', badge: 'bg-purple-100 text-purple-800 border-purple-300' };
    if (wpm >= 40) return { title: 'Fluent Typist', color: 'text-[#315CE8]', badge: 'bg-[#EEF3FF] text-[#315CE8] border-[#315CE8]/30' };
    if (wpm >= 25) return { title: 'Intermediate Typist', color: 'text-[#16845B]', badge: 'bg-emerald-50 text-[#16845B] border-emerald-300' };
    return { title: 'Developing Typist', color: 'text-[#647184]', badge: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <div className="flex flex-col gap-5 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-[#E1E7EF] bg-white p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-[#117C78] border border-[#117C78]/20 mb-2">
            <Gauge className="h-3.5 w-3.5" />
            <span>Benchmark Typing Speed & Accuracy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192230] tracking-tight">
            Typing Speed Test
          </h1>
          <p className="text-xs sm:text-sm text-[#647184] mt-1">
            Timer starts automatically when you type your first character.
          </p>
        </div>

        {/* 1, 3, 5 Minute Controls */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-[#E1E7EF] bg-[#F8FAFC] p-1.5">
          {SPEED_TEST_DURATIONS.map((d) => (
            <button
              key={d.seconds}
              type="button"
              onClick={() => {
                setSelectedDuration(d.seconds);
                handleRestart();
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedDuration === d.seconds
                  ? 'bg-[#117C78] text-white shadow-xs'
                  : 'text-[#647184] hover:text-[#192230]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card if test finished */}
      {testResult ? (
        <div className="rounded-3xl border-2 border-[#117C78]/30 bg-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#117C78] border border-[#117C78]/30 mb-3 shadow-xs">
              <Award className="h-8 w-8" />
            </div>

            <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 border ${getTypingTier(testResult.wpm).badge}`}>
              {getTypingTier(testResult.wpm).title}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#192230] font-mono tracking-tight">
              {testResult.wpm} WPM
            </h2>
            <p className="text-xs text-[#647184] mt-1">
              Test Duration: {selectedDuration / 60} minute(s) • Accuracy: {testResult.accuracy}%
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 w-full max-w-xl">
              <div className="rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#647184]">Net Speed</span>
                <div className="text-xl font-bold text-[#192230] font-mono">{testResult.wpm} WPM</div>
              </div>
              <div className="rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#647184]">Accuracy</span>
                <div className="text-xl font-bold text-[#16845B] font-mono">{testResult.accuracy}%</div>
              </div>
              <div className="rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#647184]">Chars / Min</span>
                <div className="text-xl font-bold text-[#315CE8] font-mono">{testResult.cpm}</div>
              </div>
              <div className="rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#647184]">Mistakes</span>
                <div className="text-xl font-bold text-[#D64550] font-mono">{testResult.errors}</div>
              </div>
            </div>

            {/* High-Converting 300x250 Monetization Banner */}
            <div className="my-3 flex justify-center">
              <AdBanner type="300x250" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-2 rounded-xl bg-[#117C78] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0E6461] transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Test Again</span>
              </button>
              <button
                type="button"
                onClick={handleChangePassage}
                className="flex items-center gap-2 rounded-xl border border-[#E1E7EF] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#192230] hover:bg-slate-50 transition-all shadow-xs"
              >
                <span>New Passage</span>
              </button>
              <a
                href={SMARTLINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#315CE8] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2546B8] transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>Sponsored Speed Challenge →</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <HandGuide activeChar={activeChar} />

          <TypingArea
            key={`speed-test-${testKey}-${selectedDuration}-${passageIndex}`}
            targetText={activePassage}
            timeLimitSeconds={selectedDuration}
            targetWpm={40}
            minAccuracy={90}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            onCharacterTyped={(char, key) => {
              setActiveChar(char);
              setPhysicalKey(key);
            }}
            onComplete={handleComplete}
          />

          <VirtualKeyboard
            activeChar={activeChar}
            physicallyPressedKey={physicalKey}
            showFingerColors={true}
          />
        </div>
      )}
    </div>
  );
};
