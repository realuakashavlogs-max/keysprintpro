/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateKey,
  getYesterdayKey,
  evaluateStreakStatus,
  recordPracticeStreak,
} from './streakLogic';

test('getYesterdayKey returns correct previous day', () => {
  assert.equal(getYesterdayKey('2026-10-22'), '2026-10-21');
  assert.equal(getYesterdayKey('2026-03-01'), '2026-02-28');
  assert.equal(getYesterdayKey('2026-01-01'), '2025-12-31');
});

test('evaluateStreakStatus identifies practiced today', () => {
  const status = evaluateStreakStatus('2026-10-22', 5, '2026-10-22');
  assert.equal(status.streakDays, 5);
  assert.equal(status.isMaintainedToday, true);
  assert.equal(status.isBroken, false);
  assert.equal(status.canExtendToday, false);
});

test('evaluateStreakStatus preserves active streak from yesterday', () => {
  const status = evaluateStreakStatus('2026-10-21', 4, '2026-10-22');
  assert.equal(status.streakDays, 4);
  assert.equal(status.isMaintainedToday, false);
  assert.equal(status.isBroken, false);
  assert.equal(status.canExtendToday, true);
});

test('evaluateStreakStatus detects broken streak after missed days', () => {
  const status = evaluateStreakStatus('2026-10-18', 12, '2026-10-22');
  assert.equal(status.streakDays, 0);
  assert.equal(status.isMaintainedToday, false);
  assert.equal(status.isBroken, true);
  assert.equal(status.canExtendToday, true);
});

test('recordPracticeStreak increments streak when practiced consecutive days', () => {
  const result = recordPracticeStreak('2026-10-21', 3, '2026-10-22');
  assert.equal(result.newStreak, 4);
  assert.equal(result.newActiveDate, '2026-10-22');
  assert.equal(result.streakIncreased, true);
});

test('recordPracticeStreak does not double-count multiple sessions on the same day', () => {
  const result = recordPracticeStreak('2026-10-22', 4, '2026-10-22');
  assert.equal(result.newStreak, 4);
  assert.equal(result.newActiveDate, '2026-10-22');
  assert.equal(result.streakIncreased, false);
});

test('recordPracticeStreak resets to 1 after missed day', () => {
  const result = recordPracticeStreak('2026-10-10', 15, '2026-10-22');
  assert.equal(result.newStreak, 1);
  assert.equal(result.newActiveDate, '2026-10-22');
  assert.equal(result.streakIncreased, true);
});
