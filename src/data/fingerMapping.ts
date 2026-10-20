/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FingerId, FingerInfo } from '../types/typing';

export const FINGER_DATA: Record<FingerId, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    name: 'Left Pinky',
    hand: 'left',
    homeKey: 'A',
    colorHex: '#D64550',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-600',
    borderClass: 'border-rose-400',
  },
  'left-ring': {
    id: 'left-ring',
    name: 'Left Ring',
    hand: 'left',
    homeKey: 'S',
    colorHex: '#D97706',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-600',
    borderClass: 'border-amber-400',
  },
  'left-middle': {
    id: 'left-middle',
    name: 'Left Middle',
    hand: 'left',
    homeKey: 'D',
    colorHex: '#16845B',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-600',
    borderClass: 'border-emerald-500',
  },
  'left-index': {
    id: 'left-index',
    name: 'Left Index',
    hand: 'left',
    homeKey: 'F',
    colorHex: '#315CE8',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-600',
    borderClass: 'border-blue-500',
  },
  'thumb': {
    id: 'thumb',
    name: 'Thumb',
    hand: 'thumbs',
    homeKey: 'Space',
    colorHex: '#647184',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeText: 'text-slate-600',
    borderClass: 'border-slate-400',
  },
  'right-index': {
    id: 'right-index',
    name: 'Right Index',
    hand: 'right',
    homeKey: 'J',
    colorHex: '#4361EE',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-600',
    borderClass: 'border-indigo-500',
  },
  'right-middle': {
    id: 'right-middle',
    name: 'Right Middle',
    hand: 'right',
    homeKey: 'K',
    colorHex: '#8B5CF6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-600',
    borderClass: 'border-purple-500',
  },
  'right-ring': {
    id: 'right-ring',
    name: 'Right Ring',
    hand: 'right',
    homeKey: 'L',
    colorHex: '#C026D3',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    badgeText: 'text-fuchsia-600',
    borderClass: 'border-fuchsia-500',
  },
  'right-pinky': {
    id: 'right-pinky',
    name: 'Right Pinky',
    hand: 'right',
    homeKey: ';',
    colorHex: '#117C78',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeText: 'text-teal-600',
    borderClass: 'border-teal-500',
  },
};

// Map each character (or key symbol) to its corresponding FingerId
const CHAR_TO_FINGER: Record<string, FingerId> = {
  // Left Pinky
  'q': 'left-pinky', 'Q': 'left-pinky',
  'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky',
  '1': 'left-pinky', '!': 'left-pinky',
  '`': 'left-pinky', '~': 'left-pinky',
  'Tab': 'left-pinky', 'CapsLock': 'left-pinky', 'ShiftLeft': 'left-pinky',

  // Left Ring
  'w': 'left-ring', 'W': 'left-ring',
  's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',
  '2': 'left-ring', '@': 'left-ring',

  // Left Middle
  'e': 'left-middle', 'E': 'left-middle',
  'd': 'left-middle', 'D': 'left-middle',
  'c': 'left-middle', 'C': 'left-middle',
  '3': 'left-middle', '#': 'left-middle',

  // Left Index
  'r': 'left-index', 'R': 'left-index',
  'f': 'left-index', 'F': 'left-index',
  'v': 'left-index', 'V': 'left-index',
  '4': 'left-index', '$': 'left-index',
  't': 'left-index', 'T': 'left-index',
  'g': 'left-index', 'G': 'left-index',
  'b': 'left-index', 'B': 'left-index',
  '5': 'left-index', '%': 'left-index',

  // Thumbs
  ' ': 'thumb', 'Space': 'thumb',

  // Right Index
  'y': 'right-index', 'Y': 'right-index',
  'h': 'right-index', 'H': 'right-index',
  'n': 'right-index', 'N': 'right-index',
  '6': 'right-index', '^': 'right-index',
  'u': 'right-index', 'U': 'right-index',
  'j': 'right-index', 'J': 'right-index',
  'm': 'right-index', 'M': 'right-index',
  '7': 'right-index', '&': 'right-index',

  // Right Middle
  'i': 'right-middle', 'I': 'right-middle',
  'k': 'right-middle', 'K': 'right-middle',
  ',': 'right-middle', '<': 'right-middle',
  '8': 'right-middle', '*': 'right-middle',

  // Right Ring
  'o': 'right-ring', 'O': 'right-ring',
  'l': 'right-ring', 'L': 'right-ring',
  '.': 'right-ring', '>': 'right-ring',
  '9': 'right-ring', '(': 'right-ring',

  // Right Pinky
  'p': 'right-pinky', 'P': 'right-pinky',
  ';': 'right-pinky', ':': 'right-pinky',
  '/': 'right-pinky', '?': 'right-pinky',
  '0': 'right-pinky', ')': 'right-pinky',
  '-': 'right-pinky', '_': 'right-pinky',
  '=': 'right-pinky', '+': 'right-pinky',
  '[': 'right-pinky', '{': 'right-pinky',
  ']': 'right-pinky', '}': 'right-pinky',
  '\\': 'right-pinky', '|': 'right-pinky',
  "'": 'right-pinky', '"': 'right-pinky',
  'Enter': 'right-pinky', 'Backspace': 'right-pinky', 'ShiftRight': 'right-pinky',
};

export function getFingerForKey(charOrKey: string): FingerInfo {
  if (!charOrKey) {
    return FINGER_DATA['thumb'];
  }
  const fingerId = CHAR_TO_FINGER[charOrKey] || 'thumb';
  return FINGER_DATA[fingerId];
}

export function requiresShift(char: string): boolean {
  if (!char || char.length !== 1) return false;
  // uppercase letters
  if (char >= 'A' && char <= 'Z') return true;
  // shift symbols
  const shiftSymbols = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', '|', ':', '"', '<', '>', '?'];
  return shiftSymbols.includes(char);
}

export function getShiftHand(char: string): 'left' | 'right' | null {
  if (!requiresShift(char)) return null;
  const finger = getFingerForKey(char);
  // If target key is typed with right hand, use left Shift (and vice versa)
  if (finger.hand === 'right') {
    return 'left';
  } else if (finger.hand === 'left') {
    return 'right';
  }
  return null;
}

export function getFingerInstruction(targetChar: string): {
  instruction: string;
  fingerName: string;
  handName: string;
  homeKey: string;
  requiresShift: boolean;
  shiftHand: 'left' | 'right' | null;
} {
  if (!targetChar) {
    return {
      instruction: 'Rest your fingers naturally on the home row (A S D F and J K L ;)',
      fingerName: 'All fingers',
      handName: 'Both hands',
      homeKey: 'Home Row',
      requiresShift: false,
      shiftHand: null,
    };
  }

  const finger = getFingerForKey(targetChar);
  const isShift = requiresShift(targetChar);
  const shift = getShiftHand(targetChar);

  let keyLabel = targetChar === ' ' ? 'Spacebar' : targetChar;
  if (targetChar === ';') keyLabel = 'semicolon (;)';
  if (targetChar === ',') keyLabel = 'comma (,)';
  if (targetChar === '.') keyLabel = 'period (.)';

  if (targetChar === ' ') {
    return {
      instruction: 'Press Spacebar using your thumb',
      fingerName: 'Thumb',
      handName: 'Either hand',
      homeKey: 'Space',
      requiresShift: false,
      shiftHand: null,
    };
  }

  if (isShift && shift) {
    const shiftLabel = shift === 'left' ? 'Left Shift' : 'Right Shift';
    return {
      instruction: `Hold ${shiftLabel} with your ${shift} pinky and press ${keyLabel} with your ${finger.name.toLowerCase()}`,
      fingerName: finger.name,
      handName: finger.hand === 'left' ? 'Left Hand' : 'Right Hand',
      homeKey: finger.homeKey,
      requiresShift: true,
      shiftHand: shift,
    };
  }

  return {
    instruction: `Press ${keyLabel} using your ${finger.name.toLowerCase()}`,
    fingerName: finger.name,
    handName: finger.hand === 'left' ? 'Left Hand' : 'Right Hand',
    homeKey: finger.homeKey,
    requiresShift: false,
    shiftHand: null,
  };
}
