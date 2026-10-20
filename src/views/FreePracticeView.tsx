/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, BookOpen, Edit3 } from 'lucide-react';
import { TypingArea, TypingResult } from '../components/TypingArea';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { HandGuide } from '../components/HandGuide';
import { recordPracticeSession } from '../utils/storage';
import { UserSettings, UserStats } from '../types/typing';

interface PracticePreset {
  id: string;
  category: string;
  title: string;
  text: string;
}

const PRACTICE_PRESETS: PracticePreset[] = [
  {
    id: 'lit-1',
    category: 'Literature',
    title: 'Pride and Prejudice',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings of such a man may be on his first entering a neighbourhood.',
  },
  {
    id: 'lit-2',
    category: 'Literature',
    title: 'Moby Dick',
    text: 'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
  },
  {
    id: 'phil-1',
    category: 'Philosophy',
    title: 'Meditations of Marcus Aurelius',
    text: 'When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love. The happiness of your life depends upon the quality of your thoughts.',
  },
  {
    id: 'phil-2',
    category: 'Philosophy',
    title: 'Emerson on Self-Reliance',
    text: 'Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you, the society of your contemporaries, the connection of events.',
  },
  {
    id: 'code-1',
    category: 'Coding',
    title: 'TypeScript Function & Async Flow',
    text: 'async function fetchUserProfile(userId: string): Promise<User> { const res = await fetch(`/api/users/${userId}`); if (!res.ok) throw new Error("Failed to load"); return res.json(); }',
  },
  {
    id: 'code-2',
    category: 'Coding',
    title: 'React Component Hook',
    text: 'const [count, setCount] = useState<number>(0); useEffect(() => { document.title = `Count: ${count}`; }, [count]);',
  },
];

interface FreePracticeViewProps {
  settings: UserSettings;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const FreePracticeView: React.FC<FreePracticeViewProps> = ({
  settings,
  stats,
  onUpdateStats,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('lit-1');
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [activeChar, setActiveChar] = useState<string>('');
  const [physicalKey, setPhysicalKey] = useState<string>('');
  const [practiceKey, setPracticeKey] = useState<number>(0);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);

  const selectedPreset = PRACTICE_PRESETS.find((p) => p.id === selectedPresetId) || PRACTICE_PRESETS[0];
  const activeText = isCustomMode
    ? customText.trim() || 'Type anything you like into the box above to begin custom typing practice.'
    : selectedPreset.text;

  const handleComplete = (res: TypingResult) => {
    setLastResult(res);
    const updated = recordPracticeSession(
      'free_practice',
      isCustomMode ? 'Custom Practice' : selectedPreset.title,
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
    setLastResult(null);
    setPracticeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-bold text-[#315CE8] border border-[#315CE8]/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Flexible Free Practice Sandbox</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192230] tracking-tight">
          Free Typing Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#647184] mt-1">
          Practice with famous literature, philosophy, programming snippets, or paste your own custom passage!
        </p>
      </div>

      {/* Mode and Category Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsCustomMode(false);
            handleRestart();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            !isCustomMode
              ? 'bg-[#315CE8] text-white shadow-xs'
              : 'border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Presets</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCustomMode(true);
            handleRestart();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            isCustomMode
              ? 'bg-[#315CE8] text-white shadow-xs'
              : 'border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230]'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Custom Text</span>
        </button>
      </div>

      {/* Preset Buttons Grid or Custom Textarea */}
      {!isCustomMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRACTICE_PRESETS.map((p) => {
            const isSelected = p.id === selectedPresetId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPresetId(p.id);
                  handleRestart();
                }}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#315CE8] bg-[#EEF3FF] ring-2 ring-[#315CE8]/20 shadow-xs'
                    : 'border-[#E1E7EF] bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315CE8] mb-1">
                  {p.category}
                </span>
                <span className="text-sm font-bold text-[#192230] mb-1">{p.title}</span>
                <p className="text-xs text-[#647184] line-clamp-2 leading-relaxed">{p.text}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E1E7EF] bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-[#192230] block mb-2">
            Paste or write your own practice text:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your favorite speech, poem, or book excerpt here..."
            rows={4}
            className="w-full rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 text-sm text-[#192230] placeholder-[#8692A6] focus:border-[#315CE8] focus:bg-white focus:outline-none font-mono"
          />
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-xl bg-[#315CE8] px-4 py-2 text-xs font-bold text-white hover:bg-[#2546B8] transition-colors cursor-pointer shadow-xs"
            >
              Load Custom Text
            </button>
          </div>
        </div>
      )}

      {/* Typing Engine */}
      <div className="flex flex-col gap-4">
        {/* Hand Guide */}
        {settings.showFingerGuide && <HandGuide activeChar={activeChar} />}

        <TypingArea
          key={`practice-${practiceKey}-${selectedPresetId}-${isCustomMode}`}
          targetText={activeText}
          fontSize={settings.fontSize}
          fontFamily={settings.fontFamily}
          onCharacterTyped={(char, key) => {
            setActiveChar(char);
            setPhysicalKey(key);
          }}
          onComplete={handleComplete}
        />

        {settings.showVirtualKeyboard && (
          <VirtualKeyboard
            activeChar={activeChar}
            physicallyPressedKey={physicalKey}
            showFingerColors={true}
          />
        )}
      </div>
    </div>
  );
};
