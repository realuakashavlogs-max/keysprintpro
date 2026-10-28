/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FingerId } from '../types/typing';
import { HOME_FINGER_POSITIONS, KeyLayoutItem } from '../data/keyCoordinates';
import { getShiftHand, requiresShift } from '../data/fingerMapping';

export interface FingerReachOffset {
  reachX: number;
  reachY: number;
  isHomeKey: boolean;
  fingerId: FingerId;
}

/**
 * Calculate the delta translation vector from a finger's resting home key to the target key.
 */
export function calculateFingerReach(
  fingerId: FingerId,
  targetKey: KeyLayoutItem | undefined
): FingerReachOffset {
  const home = HOME_FINGER_POSITIONS[fingerId];
  if (!home || !targetKey) {
    return { reachX: 0, reachY: 0, isHomeKey: true, fingerId };
  }

  // Thumb special handling: spacebar is wide, resting at x: 392 (left thumb) or 448 (right thumb)
  if (fingerId === 'thumb' && targetKey.id === 'Space') {
    return { reachX: 0, reachY: 0, isHomeKey: true, fingerId };
  }

  const reachX = targetKey.x - home.x;
  const reachY = targetKey.y - home.y;
  const isHomeKey = Math.abs(reachX) < 4 && Math.abs(reachY) < 4;

  return {
    reachX,
    reachY,
    isHomeKey,
    fingerId,
  };
}

/**
 * Determine if opposite hand shift key needs to be held down for shifted characters.
 */
export function getShiftGuidance(activeChar: string): {
  needsShift: boolean;
  shiftHand: 'left' | 'right' | null;
  shiftKeyId: string | null;
} {
  if (!requiresShift(activeChar)) {
    return { needsShift: false, shiftHand: null, shiftKeyId: null };
  }

  const hand = getShiftHand(activeChar);
  return {
    needsShift: true,
    shiftHand: hand,
    shiftKeyId: hand === 'left' ? 'ShiftLeft' : 'ShiftRight',
  };
}
