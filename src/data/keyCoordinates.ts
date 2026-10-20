/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FingerId } from '../types/typing';

export interface KeyLayoutItem {
  id: string;
  primary: string;
  shift?: string;
  x: number;      // Center X coordinate in 900x320 grid
  y: number;      // Center Y coordinate in 900x320 grid
  width: number;  // Keycap width in px
  height: number; // Keycap height in px
  fingerId: FingerId;
  isHomeAnchor?: boolean;
}

export const KEYBOARD_WIDTH = 900;
export const KEYBOARD_HEIGHT = 300;

export const ALL_KEY_ITEMS: KeyLayoutItem[] = [
  // ROW 1: Numbers (Y = 32)
  { id: 'Backquote', primary: '`', shift: '~', x: 42, y: 32, width: 50, height: 46, fingerId: 'left-pinky' },
  { id: 'Digit1', primary: '1', shift: '!', x: 98, y: 32, width: 50, height: 46, fingerId: 'left-pinky' },
  { id: 'Digit2', primary: '2', shift: '@', x: 154, y: 32, width: 50, height: 46, fingerId: 'left-ring' },
  { id: 'Digit3', primary: '3', shift: '#', x: 210, y: 32, width: 50, height: 46, fingerId: 'left-middle' },
  { id: 'Digit4', primary: '4', shift: '$', x: 266, y: 32, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'Digit5', primary: '5', shift: '%', x: 322, y: 32, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'Digit6', primary: '6', shift: '^', x: 378, y: 32, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'Digit7', primary: '7', shift: '&', x: 434, y: 32, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'Digit8', primary: '8', shift: '*', x: 490, y: 32, width: 50, height: 46, fingerId: 'right-middle' },
  { id: 'Digit9', primary: '9', shift: '(', x: 546, y: 32, width: 50, height: 46, fingerId: 'right-ring' },
  { id: 'Digit0', primary: '0', shift: ')', x: 602, y: 32, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Minus', primary: '-', shift: '_', x: 658, y: 32, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Equal', primary: '=', shift: '+', x: 714, y: 32, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Backspace', primary: 'Backspace', x: 807, y: 32, width: 110, height: 46, fingerId: 'right-pinky' },

  // ROW 2: Top Row (Y = 86)
  { id: 'Tab', primary: 'Tab', x: 55, y: 86, width: 75, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyQ', primary: 'q', shift: 'Q', x: 125, y: 86, width: 50, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyW', primary: 'w', shift: 'W', x: 181, y: 86, width: 50, height: 46, fingerId: 'left-ring' },
  { id: 'KeyE', primary: 'e', shift: 'E', x: 237, y: 86, width: 50, height: 46, fingerId: 'left-middle' },
  { id: 'KeyR', primary: 'r', shift: 'R', x: 293, y: 86, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'KeyT', primary: 't', shift: 'T', x: 349, y: 86, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'KeyY', primary: 'y', shift: 'Y', x: 405, y: 86, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'KeyU', primary: 'u', shift: 'U', x: 461, y: 86, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'KeyI', primary: 'i', shift: 'I', x: 517, y: 86, width: 50, height: 46, fingerId: 'right-middle' },
  { id: 'KeyO', primary: 'o', shift: 'O', x: 573, y: 86, width: 50, height: 46, fingerId: 'right-ring' },
  { id: 'KeyP', primary: 'p', shift: 'P', x: 629, y: 86, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'BracketLeft', primary: '[', shift: '{', x: 685, y: 86, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'BracketRight', primary: ']', shift: '}', x: 741, y: 86, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Backslash', primary: '\\', shift: '|', x: 818, y: 86, width: 88, height: 46, fingerId: 'right-pinky' },

  // ROW 3: Home Row (Y = 140)
  { id: 'CapsLock', primary: 'Caps', x: 63, y: 140, width: 90, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyA', primary: 'a', shift: 'A', x: 140, y: 140, width: 50, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyS', primary: 's', shift: 'S', x: 196, y: 140, width: 50, height: 46, fingerId: 'left-ring' },
  { id: 'KeyD', primary: 'd', shift: 'D', x: 252, y: 140, width: 50, height: 46, fingerId: 'left-middle' },
  { id: 'KeyF', primary: 'f', shift: 'F', x: 308, y: 140, width: 50, height: 46, fingerId: 'left-index', isHomeAnchor: true },
  { id: 'KeyG', primary: 'g', shift: 'G', x: 364, y: 140, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'KeyH', primary: 'h', shift: 'H', x: 420, y: 140, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'KeyJ', primary: 'j', shift: 'J', x: 476, y: 140, width: 50, height: 46, fingerId: 'right-index', isHomeAnchor: true },
  { id: 'KeyK', primary: 'k', shift: 'K', x: 532, y: 140, width: 50, height: 46, fingerId: 'right-middle' },
  { id: 'KeyL', primary: 'l', shift: 'L', x: 588, y: 140, width: 50, height: 46, fingerId: 'right-ring' },
  { id: 'Semicolon', primary: ';', shift: ':', x: 644, y: 140, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Quote', primary: "'", shift: '"', x: 700, y: 140, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'Enter', primary: 'Enter', x: 799, y: 140, width: 126, height: 46, fingerId: 'right-pinky' },

  // ROW 4: Bottom Row (Y = 194)
  { id: 'ShiftLeft', primary: 'Shift', x: 77, y: 194, width: 118, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyZ', primary: 'z', shift: 'Z', x: 168, y: 194, width: 50, height: 46, fingerId: 'left-pinky' },
  { id: 'KeyX', primary: 'x', shift: 'X', x: 224, y: 194, width: 50, height: 46, fingerId: 'left-ring' },
  { id: 'KeyC', primary: 'c', shift: 'C', x: 280, y: 194, width: 50, height: 46, fingerId: 'left-middle' },
  { id: 'KeyV', primary: 'v', shift: 'V', x: 336, y: 194, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'KeyB', primary: 'b', shift: 'B', x: 392, y: 194, width: 50, height: 46, fingerId: 'left-index' },
  { id: 'KeyN', primary: 'n', shift: 'N', x: 448, y: 194, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'KeyM', primary: 'm', shift: 'M', x: 504, y: 194, width: 50, height: 46, fingerId: 'right-index' },
  { id: 'Comma', primary: ',', shift: '<', x: 560, y: 194, width: 50, height: 46, fingerId: 'right-middle' },
  { id: 'Period', primary: '.', shift: '>', x: 616, y: 194, width: 50, height: 46, fingerId: 'right-ring' },
  { id: 'Slash', primary: '/', shift: '?', x: 672, y: 194, width: 50, height: 46, fingerId: 'right-pinky' },
  { id: 'ShiftRight', primary: 'Shift', x: 785, y: 194, width: 154, height: 46, fingerId: 'right-pinky' },

  // ROW 5: Space Row (Y = 248)
  { id: 'ControlLeft', primary: 'Ctrl', x: 55, y: 248, width: 75, height: 46, fingerId: 'left-pinky' },
  { id: 'AltLeft', primary: 'Alt', x: 125, y: 248, width: 50, height: 46, fingerId: 'thumb' },
  { id: 'Space', primary: 'Space', x: 392, y: 248, width: 460, height: 46, fingerId: 'thumb' },
  { id: 'AltRight', primary: 'Alt', x: 658, y: 248, width: 50, height: 46, fingerId: 'thumb' },
  { id: 'ControlRight', primary: 'Ctrl', x: 728, y: 248, width: 75, height: 46, fingerId: 'right-pinky' },
];

export function findKeyForChar(char: string): KeyLayoutItem | undefined {
  if (!char) return undefined;
  if (char === ' ') return ALL_KEY_ITEMS.find((k) => k.id === 'Space');
  const lower = char.toLowerCase();
  return (
    ALL_KEY_ITEMS.find((k) => k.shift === char) ||
    ALL_KEY_ITEMS.find((k) => k.primary.toLowerCase() === lower)
  );
}

// Resting home anchor points for fingertips (at Home Row)
export const HOME_FINGER_POSITIONS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky': { x: 140, y: 140 },  // Key A
  'left-ring': { x: 196, y: 140 },   // Key S
  'left-middle': { x: 252, y: 140 }, // Key D
  'left-index': { x: 308, y: 140 },  // Key F
  'thumb': { x: 392, y: 248 },       // Space
  'right-index': { x: 476, y: 140 }, // Key J
  'right-middle': { x: 532, y: 140 },// Key K
  'right-ring': { x: 588, y: 140 },  // Key L
  'right-pinky': { x: 644, y: 140 }, // Key ;
};
