/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelProgress, PracticeHistoryItem, UserSettings, UserStats } from '../types/typing';
import { evaluateStreakStatus, recordPracticeStreak } from './streakLogic';

const STORAGE_KEYS = {
  LEVELS_PROGRESS: 'typingmaster_levels_progress_v1',
  USER_STATS: 'typingmaster_user_stats_v1',
  SETTINGS: 'typingmaster_settings_v1',
  ACTIVE_LEVEL: 'typingmaster_active_level_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  soundVolume: 0.4,
  soundType: 'mechanical',
  showVirtualKeyboard: true,
  showFingerGuide: true,
  showLiveWpm: true,
  highlightNextKey: true,
  blindMode: false,
  fontSize: 'lg',
  fontFamily: 'mono',
};

export const DEFAULT_USER_STATS: UserStats = {
  totalKeystrokes: 0,
  totalCorrectChars: 0,
  totalErrors: 0,
  totalPracticeTimeSeconds: 0,
  highestWpm: 0,
  averageAccuracy: 100,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  history: [],
};

export function loadLevelsProgress(): Record<number, LevelProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEVELS_PROGRESS);
    if (!raw) {
      // Default: Level 1 is unlocked, all others locked
      const initial: Record<number, LevelProgress> = {
        1: {
          levelId: 1,
          completed: false,
          unlocked: true,
          stars: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          bestCpm: 0,
          attempts: 0,
        },
      };
      for (let i = 2; i <= 100; i++) {
        initial[i] = {
          levelId: i,
          completed: false,
          unlocked: false,
          stars: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          bestCpm: 0,
          attempts: 0,
        };
      }
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure all 100 levels exist in the map
    for (let i = 1; i <= 100; i++) {
      if (!parsed[i]) {
        parsed[i] = {
          levelId: i,
          completed: false,
          unlocked: i === 1,
          stars: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          bestCpm: 0,
          attempts: 0,
        };
      }
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load levels progress from localStorage', e);
    return loadLevelsProgressDefault();
  }
}

function loadLevelsProgressDefault(): Record<number, LevelProgress> {
  const initial: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 100; i++) {
    initial[i] = {
      levelId: i,
      completed: false,
      unlocked: i === 1,
      stars: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      bestCpm: 0,
      attempts: 0,
    };
  }
  return initial;
}

export function saveLevelsProgress(progress: Record<number, LevelProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVELS_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save levels progress', e);
  }
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    const parsed = raw ? JSON.parse(raw) : {};
    const merged: UserStats = { ...DEFAULT_USER_STATS, ...parsed };
    // Check if streak was broken due to missed days
    const status = evaluateStreakStatus(merged.lastActiveDate, merged.streakDays);
    merged.streakDays = status.streakDays;
    return merged;
  } catch {
    return { ...DEFAULT_USER_STATS };
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadActiveLevelId(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_LEVEL);
    if (!raw) return 1;
    const val = parseInt(raw, 10);
    return isNaN(val) || val < 1 || val > 100 ? 1 : val;
  } catch {
    return 1;
  }
}

export function saveActiveLevelId(levelId: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LEVEL, levelId.toString());
  } catch (e) {
    console.error('Failed to save active level ID', e);
  }
}

/**
 * Record a completed level or practice attempt
 */
export function recordAssessmentResult(
  levelId: number,
  wpm: number,
  accuracy: number,
  cpm: number,
  passed: boolean,
  stars: number,
  durationSeconds: number,
  totalKeystrokes: number,
  correctChars: number,
  errors: number
): { progress: Record<number, LevelProgress>; stats: UserStats; nextLevelUnlocked: boolean } {
  const progress = loadLevelsProgress();
  const current = progress[levelId] || {
    levelId,
    completed: false,
    unlocked: true,
    stars: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    bestCpm: 0,
    attempts: 0,
  };

  current.attempts += 1;
  if (wpm > current.bestWpm) current.bestWpm = wpm;
  if (accuracy > current.bestAccuracy) current.bestAccuracy = accuracy;
  if (cpm > current.bestCpm) current.bestCpm = cpm;

  let nextLevelUnlocked = false;

  if (passed) {
    current.completed = true;
    current.stars = Math.max(current.stars, stars);
    current.completedAt = new Date().toISOString();

    // Unlock next level if exists
    if (levelId < 100 && progress[levelId + 1]) {
      if (!progress[levelId + 1].unlocked) {
        progress[levelId + 1].unlocked = true;
        nextLevelUnlocked = true;
      }
    }
  }

  progress[levelId] = current;
  saveLevelsProgress(progress);

  // Update cumulative user stats
  const stats = loadUserStats();
  stats.totalKeystrokes += totalKeystrokes;
  stats.totalCorrectChars += correctChars;
  stats.totalErrors += errors;
  stats.totalPracticeTimeSeconds += durationSeconds;
  if (wpm > stats.highestWpm) stats.highestWpm = wpm;

  // Recalculate average accuracy
  if (stats.totalKeystrokes > 0) {
    stats.averageAccuracy = Math.round((stats.totalCorrectChars / stats.totalKeystrokes) * 1000) / 10;
  }

  // Calculate and record daily streak
  const streakUpdate = recordPracticeStreak(stats.lastActiveDate, stats.streakDays);
  stats.streakDays = streakUpdate.newStreak;
  stats.lastActiveDate = streakUpdate.newActiveDate;

  // Add to practice history (limit to last 50 items)
  const historyItem: PracticeHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: 'level',
    title: `Level ${levelId}`,
    levelId,
    wpm,
    cpm,
    accuracy,
    errors,
    durationSeconds,
    passed,
  };
  stats.history = [historyItem, ...(stats.history || [])].slice(0, 50);

  saveUserStats(stats);

  return { progress, stats, nextLevelUnlocked };
}

/**
 * Record a general speed test or free practice session
 */
export function recordPracticeSession(
  type: 'speed_test' | 'free_practice',
  title: string,
  wpm: number,
  cpm: number,
  accuracy: number,
  errors: number,
  durationSeconds: number,
  totalKeystrokes: number,
  correctChars: number
): UserStats {
  const stats = loadUserStats();
  stats.totalKeystrokes += totalKeystrokes;
  stats.totalCorrectChars += correctChars;
  stats.totalErrors += errors;
  stats.totalPracticeTimeSeconds += durationSeconds;
  if (wpm > stats.highestWpm) stats.highestWpm = wpm;

  if (stats.totalKeystrokes > 0) {
    stats.averageAccuracy = Math.round((stats.totalCorrectChars / stats.totalKeystrokes) * 1000) / 10;
  }

  // Update daily streak for practice sessions too
  const streakUpdate = recordPracticeStreak(stats.lastActiveDate, stats.streakDays);
  stats.streakDays = streakUpdate.newStreak;
  stats.lastActiveDate = streakUpdate.newActiveDate;

  const historyItem: PracticeHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type,
    title,
    wpm,
    cpm,
    accuracy,
    errors,
    durationSeconds,
  };
  stats.history = [historyItem, ...(stats.history || [])].slice(0, 50);

  saveUserStats(stats);
  return stats;
}

export function resetAllProgress(): void {
  localStorage.removeItem(STORAGE_KEYS.LEVELS_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.USER_STATS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_LEVEL);
}
