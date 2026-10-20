import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWpm,
  calculateCpm,
  calculateAccuracy,
  calculateStars,
  assessLevelPassed,
  formatTime,
} from './typingLogic.ts';
import { getFingerForKey, requiresShift, getShiftHand } from '../data/fingerMapping.ts';

test('WPM calculation is accurate and standard', () => {
  // 50 characters in 60 seconds = 10 words / 1 min = 10 WPM
  assert.equal(calculateWpm(50, 60), 10);
  // 250 characters in 60 seconds = 50 WPM
  assert.equal(calculateWpm(250, 60), 50);
  // 0 characters or 0 seconds returns 0
  assert.equal(calculateWpm(0, 60), 0);
  assert.equal(calculateWpm(100, 0), 0);
});

test('CPM calculation is accurate', () => {
  assert.equal(calculateCpm(120, 60), 120);
  assert.equal(calculateCpm(60, 30), 120);
  assert.equal(calculateCpm(0, 30), 0);
});

test('Accuracy calculation handles edge cases', () => {
  assert.equal(calculateAccuracy(100, 100), 100);
  assert.equal(calculateAccuracy(95, 100), 95);
  assert.equal(calculateAccuracy(0, 10), 0);
  // Total keystrokes 0 defaults to 100%
  assert.equal(calculateAccuracy(0, 0), 100);
});

test('Level assessment passes and awards stars appropriately', () => {
  const resultPass = assessLevelPassed(95, 25, 90, 20);
  assert.equal(resultPass.passed, true);
  assert.ok(resultPass.stars >= 2);

  const resultFailAcc = assessLevelPassed(80, 40, 90, 20);
  assert.equal(resultFailAcc.passed, false);
  assert.equal(resultFailAcc.stars, 0);

  const resultFailWpm = assessLevelPassed(98, 10, 90, 25);
  assert.equal(resultFailWpm.passed, false);
});

test('Finger mapping identifies correct touch typing assignments', () => {
  // Home row left hand
  assert.equal(getFingerForKey('a')?.id, 'left-pinky');
  assert.equal(getFingerForKey('s')?.id, 'left-ring');
  assert.equal(getFingerForKey('d')?.id, 'left-middle');
  assert.equal(getFingerForKey('f')?.id, 'left-index');

  // Home row right hand
  assert.equal(getFingerForKey('j')?.id, 'right-index');
  assert.equal(getFingerForKey('k')?.id, 'right-middle');
  assert.equal(getFingerForKey('l')?.id, 'right-ring');
  assert.equal(getFingerForKey(';')?.[0]?.id || getFingerForKey(';')?.id, 'right-pinky');

  // Space
  assert.equal(getFingerForKey(' ')?.id, 'thumb');

  // Shift requirements
  assert.equal(requiresShift('A'), true);
  assert.equal(requiresShift('a'), false);
  assert.equal(getShiftHand('A'), 'right'); // Left hand types 'A', right hand holds Shift!
  assert.equal(getShiftHand('K'), 'left');  // Right hand types 'K', left hand holds Shift!
});

test('formatTime formats seconds into mm:ss', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(120), '2:00');
});
