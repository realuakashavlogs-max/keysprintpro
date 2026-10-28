/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFingerReach, getShiftGuidance } from './fingerAnimationLogic';
import { ALL_KEY_ITEMS, findKeyForChar } from '../data/keyCoordinates';

test('calculateFingerReach returns zero offset for home row anchor F', () => {
  const keyF = findKeyForChar('f');
  assert.ok(keyF);
  const reach = calculateFingerReach('left-index', keyF);
  assert.equal(reach.isHomeKey, true);
  assert.equal(reach.reachX, 0);
  assert.equal(reach.reachY, 0);
});

test('calculateFingerReach calculates upward movement for top row key R', () => {
  const keyR = findKeyForChar('r');
  assert.ok(keyR);
  const reach = calculateFingerReach('left-index', keyR);
  assert.equal(reach.isHomeKey, false);
  // Key R (293, 86) from Home F (308, 140) => dx = -15, dy = -54
  assert.equal(reach.reachX, -15);
  assert.equal(reach.reachY, -54);
});

test('calculateFingerReach calculates downward movement for bottom row key V', () => {
  const keyV = findKeyForChar('v');
  assert.ok(keyV);
  const reach = calculateFingerReach('left-index', keyV);
  assert.equal(reach.isHomeKey, false);
  // Key V (336, 194) from Home F (308, 140) => dx = 28, dy = 54
  assert.equal(reach.reachX, 28);
  assert.equal(reach.reachY, 54);
});

test('calculateFingerReach handles right hand home row anchor J', () => {
  const keyJ = findKeyForChar('j');
  assert.ok(keyJ);
  const reach = calculateFingerReach('right-index', keyJ);
  assert.equal(reach.isHomeKey, true);
  assert.equal(reach.reachX, 0);
  assert.equal(reach.reachY, 0);
});

test('getShiftGuidance returns correct opposite hand shift for uppercase letters', () => {
  // Uppercase A is typed by left pinky -> right hand holds shift
  const guideA = getShiftGuidance('A');
  assert.equal(guideA.needsShift, true);
  assert.equal(guideA.shiftHand, 'right');
  assert.equal(guideA.shiftKeyId, 'ShiftRight');

  // Uppercase J is typed by right index -> left hand holds shift
  const guideJ = getShiftGuidance('J');
  assert.equal(guideJ.needsShift, true);
  assert.equal(guideJ.shiftHand, 'left');
  assert.equal(guideJ.shiftKeyId, 'ShiftLeft');

  // Lowercase letters do not need shift
  const guideLower = getShiftGuidance('a');
  assert.equal(guideLower.needsShift, false);
});
