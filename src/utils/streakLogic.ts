/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Pure helper to format a Date object as YYYY-MM-DD in local time
 */
export function formatDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the date string for the day prior to the given date string
 */
export function getYesterdayKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
}

export interface StreakStatus {
  streakDays: number;
  isMaintainedToday: boolean;
  isBroken: boolean;
  canExtendToday: boolean;
}

/**
 * Assess the current streak status given the user's stored last active date and streak count.
 */
export function evaluateStreakStatus(
  lastActiveDate: string | null | undefined,
  storedStreak: number,
  currentDateKey: string = formatDateKey()
): StreakStatus {
  if (!lastActiveDate) {
    return {
      streakDays: Math.max(0, storedStreak || 0),
      isMaintainedToday: false,
      isBroken: false,
      canExtendToday: true,
    };
  }

  const yesterdayKey = getYesterdayKey(currentDateKey);

  if (lastActiveDate === currentDateKey) {
    // User already completed a session today
    return {
      streakDays: Math.max(1, storedStreak),
      isMaintainedToday: true,
      isBroken: false,
      canExtendToday: false,
    };
  }

  if (lastActiveDate === yesterdayKey) {
    // User practiced yesterday, hasn't practiced yet today; streak is still valid!
    return {
      streakDays: Math.max(1, storedStreak),
      isMaintainedToday: false,
      isBroken: false,
      canExtendToday: true,
    };
  }

  // More than 1 day has elapsed without practice; streak was broken
  return {
    streakDays: 0,
    isMaintainedToday: false,
    isBroken: true,
    canExtendToday: true,
  };
}

/**
 * Compute the updated streak when the user completes an exercise/test/session today.
 */
export function recordPracticeStreak(
  lastActiveDate: string | null | undefined,
  currentStreak: number,
  currentDateKey: string = formatDateKey()
): { newStreak: number; newActiveDate: string; streakIncreased: boolean } {
  if (lastActiveDate === currentDateKey) {
    // Already counted today
    return {
      newStreak: Math.max(1, currentStreak),
      newActiveDate: currentDateKey,
      streakIncreased: false,
    };
  }

  const yesterdayKey = getYesterdayKey(currentDateKey);

  if (lastActiveDate === yesterdayKey) {
    // Practiced yesterday -> consecutive day practice!
    const newStreak = Math.max(1, currentStreak) + 1;
    return {
      newStreak,
      newActiveDate: currentDateKey,
      streakIncreased: true,
    };
  }

  // Either new user or broke streak -> start at 1
  return {
    newStreak: 1,
    newActiveDate: currentDateKey,
    streakIncreased: true,
  };
}
