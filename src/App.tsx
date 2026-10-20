/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavView } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { LessonView } from './views/LessonView';
import { AllLevelsView } from './views/AllLevelsView';
import { SpeedTestView } from './views/SpeedTestView';
import { FreePracticeView } from './views/FreePracticeView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import { MasterDiplomaModal } from './components/MasterDiplomaModal';
import { ResponsiveAdLeaderboard, AdBanner, SMARTLINK_URL } from './components/AdBanner';
import {
  loadActiveLevelId,
  loadLevelsProgress,
  loadSettings,
  loadUserStats,
  resetAllProgress,
  saveActiveLevelId,
  saveSettings,
} from './utils/storage';
import { soundEngine } from './utils/audio';
import { LevelProgress, UserSettings, UserStats } from './types/typing';
import { Keyboard, Heart } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [levelsProgress, setLevelsProgress] = useState<Record<number, LevelProgress>>({});
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [stageFilter, setStageFilter] = useState<number>(0);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedProgress = loadLevelsProgress();
    const loadedStats = loadUserStats();
    const loadedSettings = loadSettings();
    const loadedLevelId = loadActiveLevelId();

    setLevelsProgress(loadedProgress);
    setStats(loadedStats);
    setSettings(loadedSettings);
    setActiveLevelId(loadedLevelId);
    soundEngine.configure(
      loadedSettings.soundEnabled,
      loadedSettings.soundVolume,
      loadedSettings.soundType
    );
    setIsLoaded(true);

    // Support ?autostart=1 query param as per guidelines
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentView('lesson');
    }
  }, []);

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    saveActiveLevelId(levelId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToLevels = (selectedStage?: number) => {
    setStageFilter(selectedStage || 0);
    setCurrentView('levels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProgress = (
    newProgress: Record<number, LevelProgress>,
    newStats: UserStats
  ) => {
    setLevelsProgress(newProgress);
    setStats(newStats);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetProgress = () => {
    resetAllProgress();
    const freshProgress = loadLevelsProgress();
    const freshStats = loadUserStats();
    setLevelsProgress(freshProgress);
    setStats(freshStats);
    setActiveLevelId(1);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] text-[#192230]">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#315CE8] border-t-transparent" />
          <span className="text-sm font-semibold text-[#192230]">Loading KeySprint...</span>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(levelsProgress).filter((p) => p.completed).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#192230] flex flex-col selection:bg-[#315CE8]/20">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeLevelId={activeLevelId}
        stats={stats}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Top Monetization Leaderboard Banner (728x90 / 468x60 / 320x50) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <ResponsiveAdLeaderboard />
      </div>

      {/* Main Content Area with Side Skyscraper Banners on Large Screens */}
      <div className="flex-1 w-full max-w-[1560px] mx-auto px-2 sm:px-4 flex justify-center items-start gap-4">
        {/* Left Skyscraper Banner (160x600) on Extra Large Screens */}
        <aside className="hidden 2xl:flex flex-col items-center sticky top-20 pt-4 shrink-0">
          <AdBanner type="160x600" />
        </aside>

        {/* Central Main Content */}
        <main className="flex-1 w-full max-w-5xl">
          {currentView === 'home' && (
            <HomeView
              levelsProgress={levelsProgress}
              activeLevelId={activeLevelId}
              stats={stats}
              onStartLevel={handleStartLevel}
              onNavigateToLevels={handleNavigateToLevels}
              onNavigateToSpeedTest={() => handleNavigate('speed_test')}
            />
          )}

          {currentView === 'lesson' && (
            <LessonView
              levelId={activeLevelId}
              levelsProgress={levelsProgress}
              settings={settings}
              stats={stats}
              onUpdateProgress={handleUpdateProgress}
              onSelectLevel={handleStartLevel}
              onOpen100DiplomaModal={() => setIsDiplomaOpen(true)}
            />
          )}

          {currentView === 'levels' && (
            <AllLevelsView
              levelsProgress={levelsProgress}
              activeLevelId={activeLevelId}
              initialStageFilter={stageFilter}
              onSelectLevel={handleStartLevel}
            />
          )}

          {currentView === 'speed_test' && (
            <SpeedTestView
              settings={settings}
              stats={stats}
              onUpdateStats={(newStats) => setStats(newStats)}
            />
          )}

          {currentView === 'free_practice' && (
            <FreePracticeView
              settings={settings}
              stats={stats}
              onUpdateStats={(newStats) => setStats(newStats)}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              levelsProgress={levelsProgress}
              stats={stats}
              onOpenDiploma={() => setIsDiplomaOpen(true)}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>

        {/* Right Skyscraper Banner (160x300 or 160x600) on Extra Large Screens */}
        <aside className="hidden 2xl:flex flex-col items-center sticky top-20 pt-4 shrink-0">
          <AdBanner type="160x300" />
          <div className="mt-4 rounded-xl border border-[#E1E7EF] bg-white p-3 text-center w-[160px] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#315CE8] block mb-1">
              Speed Challenge
            </span>
            <p className="text-[11px] text-[#647184] mb-2 leading-tight">
              Test your global ranking
            </p>
            <a
              href={SMARTLINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full rounded-lg bg-[#315CE8] py-1.5 text-[11px] font-bold text-white hover:bg-[#2546B8] transition-colors"
            >
              Start Now →
            </a>
          </div>
        </aside>
      </div>

      {/* Bottom Monetization Leaderboard Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <ResponsiveAdLeaderboard />
      </div>

      {/* Diploma Modal */}
      <MasterDiplomaModal
        isOpen={isDiplomaOpen}
        stats={stats}
        completedLevelsCount={completedCount}
        onClose={() => setIsDiplomaOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#E1E7EF] bg-white py-6 text-center text-xs text-[#647184] mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#315CE8] text-white font-mono text-xs font-bold shadow-xs">
              K
            </div>
            <span className="font-bold text-[#192230]">KeySprint</span>
            <span className="text-[#8692A6]">·</span>
            <span>Professional Touch Typing Master</span>
          </div>

          <div className="flex items-center gap-4 text-[#647184]">
            <a
              href={SMARTLINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#315CE8] hover:underline flex items-center gap-1"
            >
              <span>⚡ Partner Typing Rewards</span>
            </a>
            <span className="text-[#CBD5E1]">•</span>
            <span>Structured Muscle Memory & Real-Time Hand Guidance</span>
          </div>

          <div className="text-[#8692A6] font-mono text-[11px]">
            100 Levels · 10 Stages · QWERTY Standard
          </div>
        </div>
      </footer>
    </div>
  );
}
