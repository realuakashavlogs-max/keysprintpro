/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FINGER_DATA, getFingerForKey, getShiftHand, requiresShift } from '../data/fingerMapping';

interface VirtualKeyboardProps {
  activeChar?: string;
  physicallyPressedKey?: string;
  showFingerColors?: boolean;
}

interface KeyConfig {
  id: string;
  primary: string;
  shift?: string;
  width?: string;
  fingerId?: keyof typeof FINGER_DATA;
  isHomeAnchor?: boolean;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1: Number Row
  [
    { id: 'Backquote', primary: '`', shift: '~', fingerId: 'left-pinky' },
    { id: 'Digit1', primary: '1', shift: '!', fingerId: 'left-pinky' },
    { id: 'Digit2', primary: '2', shift: '@', fingerId: 'left-ring' },
    { id: 'Digit3', primary: '3', shift: '#', fingerId: 'left-middle' },
    { id: 'Digit4', primary: '4', shift: '$', fingerId: 'left-index' },
    { id: 'Digit5', primary: '5', shift: '%', fingerId: 'left-index' },
    { id: 'Digit6', primary: '6', shift: '^', fingerId: 'right-index' },
    { id: 'Digit7', primary: '7', shift: '&', fingerId: 'right-index' },
    { id: 'Digit8', primary: '8', shift: '*', fingerId: 'right-middle' },
    { id: 'Digit9', primary: '9', shift: '(', fingerId: 'right-ring' },
    { id: 'Digit0', primary: '0', shift: ')', fingerId: 'right-pinky' },
    { id: 'Minus', primary: '-', shift: '_', fingerId: 'right-pinky' },
    { id: 'Equal', primary: '=', shift: '+', fingerId: 'right-pinky' },
    { id: 'Backspace', primary: 'Backspace', width: 'w-16 sm:w-20', fingerId: 'right-pinky' },
  ],
  // Row 2: Top Row
  [
    { id: 'Tab', primary: 'Tab', width: 'w-12 sm:w-16', fingerId: 'left-pinky' },
    { id: 'KeyQ', primary: 'q', shift: 'Q', fingerId: 'left-pinky' },
    { id: 'KeyW', primary: 'w', shift: 'W', fingerId: 'left-ring' },
    { id: 'KeyE', primary: 'e', shift: 'E', fingerId: 'left-middle' },
    { id: 'KeyR', primary: 'r', shift: 'R', fingerId: 'left-index' },
    { id: 'KeyT', primary: 't', shift: 'T', fingerId: 'left-index' },
    { id: 'KeyY', primary: 'y', shift: 'Y', fingerId: 'right-index' },
    { id: 'KeyU', primary: 'u', shift: 'U', fingerId: 'right-index' },
    { id: 'KeyI', primary: 'i', shift: 'I', fingerId: 'right-middle' },
    { id: 'KeyO', primary: 'o', shift: 'O', fingerId: 'right-ring' },
    { id: 'KeyP', primary: 'p', shift: 'P', fingerId: 'right-pinky' },
    { id: 'BracketLeft', primary: '[', shift: '{', fingerId: 'right-pinky' },
    { id: 'BracketRight', primary: ']', shift: '}', fingerId: 'right-pinky' },
    { id: 'Backslash', primary: '\\', shift: '|', width: 'w-12 sm:w-14', fingerId: 'right-pinky' },
  ],
  // Row 3: Home Row
  [
    { id: 'CapsLock', primary: 'Caps', width: 'w-14 sm:w-18', fingerId: 'left-pinky' },
    { id: 'KeyA', primary: 'a', shift: 'A', fingerId: 'left-pinky' },
    { id: 'KeyS', primary: 's', shift: 'S', fingerId: 'left-ring' },
    { id: 'KeyD', primary: 'd', shift: 'D', fingerId: 'left-middle' },
    { id: 'KeyF', primary: 'f', shift: 'F', fingerId: 'left-index', isHomeAnchor: true },
    { id: 'KeyG', primary: 'g', shift: 'G', fingerId: 'left-index' },
    { id: 'KeyH', primary: 'h', shift: 'H', fingerId: 'right-index' },
    { id: 'KeyJ', primary: 'j', shift: 'J', fingerId: 'right-index', isHomeAnchor: true },
    { id: 'KeyK', primary: 'k', shift: 'K', fingerId: 'right-middle' },
    { id: 'KeyL', primary: 'l', shift: 'L', fingerId: 'right-ring' },
    { id: 'Semicolon', primary: ';', shift: ':', fingerId: 'right-pinky' },
    { id: 'Quote', primary: "'", shift: '"', fingerId: 'right-pinky' },
    { id: 'Enter', primary: 'Enter', width: 'w-16 sm:w-20', fingerId: 'right-pinky' },
  ],
  // Row 4: Bottom Row
  [
    { id: 'ShiftLeft', primary: 'Shift', width: 'w-16 sm:w-22', fingerId: 'left-pinky' },
    { id: 'KeyZ', primary: 'z', shift: 'Z', fingerId: 'left-pinky' },
    { id: 'KeyX', primary: 'x', shift: 'X', fingerId: 'left-ring' },
    { id: 'KeyC', primary: 'c', shift: 'C', fingerId: 'left-middle' },
    { id: 'KeyV', primary: 'v', shift: 'V', fingerId: 'left-index' },
    { id: 'KeyB', primary: 'b', shift: 'B', fingerId: 'left-index' },
    { id: 'KeyN', primary: 'n', shift: 'N', fingerId: 'right-index' },
    { id: 'KeyM', primary: 'm', shift: 'M', fingerId: 'right-index' },
    { id: 'Comma', primary: ',', shift: '<', fingerId: 'right-middle' },
    { id: 'Period', primary: '.', shift: '>', fingerId: 'right-ring' },
    { id: 'Slash', primary: '/', shift: '?', fingerId: 'right-pinky' },
    { id: 'ShiftRight', primary: 'Shift', width: 'w-16 sm:w-22', fingerId: 'right-pinky' },
  ],
  // Row 5: Space Row
  [
    { id: 'ControlLeft', primary: 'Ctrl', width: 'w-12 sm:w-16', fingerId: 'left-pinky' },
    { id: 'AltLeft', primary: 'Alt', width: 'w-10 sm:w-14', fingerId: 'thumb' },
    { id: 'Space', primary: 'Space', width: 'flex-1 max-w-[320px] sm:max-w-[420px]', fingerId: 'thumb' },
    { id: 'AltRight', primary: 'Alt', width: 'w-10 sm:w-14', fingerId: 'thumb' },
    { id: 'ControlRight', primary: 'Ctrl', width: 'w-12 sm:w-16', fingerId: 'right-pinky' },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeChar = '',
  physicallyPressedKey = '',
  showFingerColors = true,
}) => {
  const isShift = requiresShift(activeChar);
  const shiftHand = getShiftHand(activeChar);
  const activeFinger = activeChar ? getFingerForKey(activeChar) : null;

  const isKeyActive = (key: KeyConfig): boolean => {
    if (!activeChar) return false;
    if (activeChar === ' ' && key.id === 'Space') return true;
    if (key.primary.toLowerCase() === activeChar.toLowerCase()) return true;
    if (key.shift === activeChar) return true;
    return false;
  };

  const isShiftKeyActive = (keyId: string): boolean => {
    if (!isShift) return false;
    if (keyId === 'ShiftLeft' && shiftHand === 'left') return true;
    if (keyId === 'ShiftRight' && shiftHand === 'right') return true;
    return false;
  };

  const isPhysicallyPressed = (key: KeyConfig): boolean => {
    if (!physicallyPressedKey) return false;
    const pressedLower = physicallyPressedKey.toLowerCase();
    if (physicallyPressedKey === ' ' && key.id === 'Space') return true;
    if (key.primary.toLowerCase() === pressedLower) return true;
    if (key.shift && key.shift.toLowerCase() === pressedLower) return true;
    if (key.id.toLowerCase() === pressedLower) return true;
    return false;
  };

  return (
    <div className="w-full select-none rounded-2xl border border-[#E1E7EF] bg-[#F8FAFC] p-3 sm:p-4 shadow-xs">
      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const active = isKeyActive(key);
              const shiftActive = isShiftKeyActive(key.id);
              const physical = isPhysicallyPressed(key);
              const finger = key.fingerId ? FINGER_DATA[key.fingerId] : null;

              const fingerColorStyle =
                showFingerColors && finger
                  ? { borderBottomColor: finger.colorHex, borderBottomWidth: '3px' }
                  : {};

              let keyStateClass =
                'bg-white text-[#192230] border-[#E1E7EF] hover:bg-slate-50 shadow-xs';

              if (physical) {
                keyStateClass =
                  'bg-[#16845B] text-white border-[#16845B] scale-[0.96] shadow-inner font-bold';
              } else if (active) {
                keyStateClass =
                  'bg-[#315CE8] text-white font-bold border-[#315CE8] ring-2 ring-[#315CE8]/40 shadow-sm animate-pulse';
              } else if (shiftActive) {
                keyStateClass =
                  'bg-[#E8AC45] text-[#192230] font-bold border-amber-400 ring-2 ring-amber-300 shadow-sm animate-pulse';
              }

              return (
                <div
                  key={key.id}
                  style={fingerColorStyle}
                  className={`relative flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-75 min-h-[38px] sm:min-h-[46px] min-w-[28px] sm:min-w-[40px] px-1 sm:px-2 ${
                    key.width || 'flex-1'
                  } ${keyStateClass}`}
                >
                  {/* Shift label */}
                  {key.shift && (
                    <span
                      className={`text-[9px] sm:text-[10px] leading-tight font-medium ${
                        active || physical ? 'text-blue-100' : 'text-[#8692A6]'
                      }`}
                    >
                      {key.shift}
                    </span>
                  )}

                  {/* Primary key label */}
                  <span
                    className={`text-xs sm:text-sm font-semibold capitalize ${
                      active || physical ? 'text-white' : 'text-[#192230]'
                    }`}
                  >
                    {key.primary === 'Space' ? 'Space' : key.primary}
                  </span>

                  {/* Tactile bumps on F and J */}
                  {key.isHomeAnchor && (
                    <div
                      className={`absolute bottom-1 h-0.5 sm:h-1 w-3 sm:w-4 rounded-full ${
                        active || physical ? 'bg-white' : 'bg-[#315CE8]'
                      }`}
                    />
                  )}

                  {/* Shift badge indicator if this Shift key is required */}
                  {shiftActive && (
                    <span className="absolute -top-2 rounded-full bg-amber-400 px-1 py-0.2 text-[8px] sm:text-[9px] font-bold text-slate-950 shadow-xs">
                      HOLD
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Keyboard Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E1E7EF] pt-2.5 text-xs text-[#647184]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#192230]">Next Strike:</span>
          {activeChar ? (
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md border border-[#315CE8] bg-[#EEF3FF] px-1.5 font-mono text-xs font-bold text-[#315CE8]">
                {activeChar === ' ' ? 'Space' : activeChar}
              </span>
              {activeFinger && (
                <span className="text-xs text-[#647184]">
                  with <strong className="text-[#192230]">{activeFinger.name}</strong> (Rest on{' '}
                  <strong className="text-[#192230] font-mono">{activeFinger.homeKey}</strong>)
                </span>
              )}
            </div>
          ) : (
            <span>Ready</span>
          )}
        </div>

        {showFingerColors && (
          <div className="hidden sm:flex items-center gap-2 text-[11px]">
            <span className="text-[#8692A6]">Fingers:</span>
            <span className="flex items-center gap-1 text-[#D64550]">
              <span className="h-2 w-2 rounded-full bg-[#D64550]" /> L.Pinky
            </span>
            <span className="flex items-center gap-1 text-[#D97706]">
              <span className="h-2 w-2 rounded-full bg-[#D97706]" /> L.Ring
            </span>
            <span className="flex items-center gap-1 text-[#16845B]">
              <span className="h-2 w-2 rounded-full bg-[#16845B]" /> L.Middle
            </span>
            <span className="flex items-center gap-1 text-[#315CE8]">
              <span className="h-2 w-2 rounded-full bg-[#315CE8]" /> L.Index
            </span>
            <span className="flex items-center gap-1 text-[#4361EE]">
              <span className="h-2 w-2 rounded-full bg-[#4361EE]" /> R.Index
            </span>
            <span className="flex items-center gap-1 text-[#8B5CF6]">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> R.Middle
            </span>
            <span className="flex items-center gap-1 text-[#C026D3]">
              <span className="h-2 w-2 rounded-full bg-[#C026D3]" /> R.Ring
            </span>
            <span className="flex items-center gap-1 text-[#117C78]">
              <span className="h-2 w-2 rounded-full bg-[#117C78]" /> R.Pinky
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
