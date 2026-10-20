/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Flame,
  BookOpen,
  Gauge,
  Grid,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { UserSettings, UserStats } from '../types/typing';
import { soundEngine } from '../utils/audio';
import { SMARTLINK_URL } from './AdBanner';

export type NavView =
  | 'home'
  | 'lesson'
  | 'levels'
  | 'speed_test'
  | 'free_practice'
  | 'progress'
  | 'settings';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  activeLevelId: number;
  stats: UserStats;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeLevelId,
  stats,
  settings,
  onUpdateSettings,
}) => {
  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    soundEngine.configure(updated.soundEnabled, updated.soundVolume, updated.soundType);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E1E7EF] bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* KeySprint Brand Wordmark */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('home')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('home');
          }}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* KeySprint Key Symbol */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315CE8] text-white font-mono font-black text-lg shadow-sm border border-[#2546B8]">
            K
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#192230] text-lg tracking-tight font-sans">
                KeySprint
              </span>
              <span className="rounded-md bg-[#EEF3FF] px-1.5 py-0.5 text-[10px] font-bold text-[#315CE8] border border-[#315CE8]/20">
                PRO
              </span>
            </div>
            <p className="hidden text-[11px] text-[#647184] font-medium sm:block -mt-0.5">
              Professional Touch Typing
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 rounded-xl bg-[#F8FAFC] border border-[#E1E7EF] p-1">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigate('lesson')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'lesson'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Lesson {activeLevelId}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('speed_test')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'speed_test'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            <Gauge className="h-3.5 w-3.5" />
            <span>Speed Test</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('levels')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'levels'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>100 Levels</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('free_practice')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'free_practice'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Practice</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'progress'
                ? 'bg-[#315CE8] text-white shadow-xs'
                : 'text-[#647184] hover:bg-slate-200/60 hover:text-[#192230]'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Progress</span>
          </button>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2">
          {/* Partner Speed Challenge Smartlink */}
          <a
            href={SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#315CE8] to-[#117C78] px-2.5 py-1 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
            title="Earn rewards in the global typing challenge"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Bonus Challenge</span>
          </a>

          {/* Daily Streak */}
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{stats.streakDays}d Streak</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E1E7EF] bg-white text-[#647184] hover:text-[#192230] hover:bg-slate-50 transition-colors shadow-xs"
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-[#16845B]" />
            ) : (
              <VolumeX className="h-4 w-4 text-[#8692A6]" />
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label="Settings"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#E1E7EF] transition-colors shadow-xs ${
              currentView === 'settings'
                ? 'bg-[#315CE8] text-white border-[#315CE8]'
                : 'bg-white text-[#647184] hover:text-[#192230] hover:bg-slate-50'
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#E1E7EF] px-3 py-1.5 scrollbar-none gap-1 bg-[#F8FAFC]">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'home' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => onNavigate('lesson')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'lesson' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          Lesson {activeLevelId}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('speed_test')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'speed_test' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          Speed Test
        </button>
        <button
          type="button"
          onClick={() => onNavigate('levels')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'levels' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          100 Levels
        </button>
        <button
          type="button"
          onClick={() => onNavigate('free_practice')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'free_practice' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          Practice
        </button>
        <button
          type="button"
          onClick={() => onNavigate('progress')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            currentView === 'progress' ? 'bg-[#315CE8] text-white' : 'text-[#647184]'
          }`}
        >
          Progress
        </button>
      </div>
    </header>
  );
};
