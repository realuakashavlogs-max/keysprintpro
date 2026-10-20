/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

test('calculateWpm standard formula (5 chars = 1 word)', () => {
  // 50 correct chars in 60 seconds = 10 words / 1 min = 10 WPM
  assert.equal(calculateWpm(50, 60), 10);
  // 250 correct chars in 60 seconds = 50 WPM
  assert.equal(calculateWpm(250, 60), 50);
  // 100 correct chars in 30 seconds = 20 words / 0.5 min = 40 WPM
  assert.equal(calculateWpm(100, 30), 40);
  // 0 chars
  assert.equal(calculateWpm(0, 10), 0);
  // 0 seconds
  assert.equal(calculateWpm(10, 0), 0);
});

test('calculateCpm formula', () => {
  // 120 chars in 60s = 120 CPM
  assert.equal(calculateCpm(120, 60), 120);
  // 60 chars in 30s = 120 CPM
  assert.equal(calculateCpm(60, 30), 120);
});

test('calculateAccuracy calculation', () => {
  assert.equal(calculateAccuracy(100, 100), 100);
  assert.equal(calculateAccuracy(90, 100), 90);
  assert.equal(calculateAccuracy(95, 100), 95);
  assert.equal(calculateAccuracy(0, 50), 0);
  assert.equal(calculateAccuracy(0, 0), 100); // initial empty state
});

test('calculateStars assessment thresholds', () => {
  // High accuracy (>= minAccuracy + 4) and high WPM (>= targetWpm + 5) => 3 stars
  assert.equal(calculateStars(96, 25, 90, 15), 3);
  // Passed both targets => 2 stars
  assert.equal(calculateStars(92, 16, 90, 15), 2);
  // Below min accuracy => 0 stars
  assert.equal(calculateStars(85, 40, 90, 15), 0);
});

test('assessLevelPassed validation and feedback', () => {
  const resultPass = assessLevelPassed(95, 20, 90, 15);
  assert.equal(resultPass.passed, true);
  assert.ok(resultPass.stars >= 2);

  const resultFailAccuracy = assessLevelPassed(80, 40, 90, 15);
  assert.equal(resultFailAccuracy.passed, false);
  assert.ok(resultFailAccuracy.message.includes('Accuracy was 80%'));

  const resultFailSpeed = assessLevelPassed(95, 8, 90, 20);
  assert.equal(resultFailSpeed.passed, false);
  assert.ok(resultFailSpeed.message.includes('Speed was 8 WPM'));
});

test('formatTime mm:ss output', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(9), '0:09');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(600), '10:00');
});

test('curriculum integrity: exactly 100 levels with valid exercises and assessments', async () => {
  const { ALL_LEVELS } = await import('../data/levels.ts');
  assert.equal(ALL_LEVELS.length, 100, 'Must have exactly 100 levels');

  for (let i = 1; i <= 100; i++) {
    const level = ALL_LEVELS.find((l) => l.id === i);
    assert.ok(level, `Level ${i} must exist`);
    assert.ok(level.title.length > 3, `Level ${i} must have a valid title`);
    assert.ok(level.objective.length > 5, `Level ${i} must have a valid objective`);
    assert.ok(level.instructions.length > 10, `Level ${i} must have detailed instructions`);
    assert.ok(level.exercises.length >= 1, `Level ${i} must have at least 1 exercise`);
    assert.ok(level.assessment, `Level ${i} must have a final assessment`);
    assert.ok(level.assessment.targetText.length >= 10, `Level ${i} assessment must have target text`);
    assert.ok(level.minAccuracy >= 85 && level.minAccuracy <= 100, `Level ${i} minAccuracy must be valid`);
    assert.ok(level.targetWpm >= 10 && level.targetWpm <= 120, `Level ${i} targetWpm must be realistic`);

    // Verify each exercise has text
    for (const ex of level.exercises) {
      assert.ok(ex.targetText.length > 0, `Exercise ${ex.id} in level ${i} must have target text`);
    }
  }
});
