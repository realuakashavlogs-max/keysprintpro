/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  ALL_KEY_ITEMS,
  findKeyForChar,
  HOME_FINGER_POSITIONS,
  KEYBOARD_WIDTH,
  KEYBOARD_HEIGHT,
  KeyLayoutItem,
} from '../data/keyCoordinates';
import { FINGER_DATA, getFingerForKey, getShiftHand, requiresShift } from '../data/fingerMapping';
import { FingerId } from '../types/typing';

interface AnimatedKeyboardWithHandsProps {
  activeChar?: string;
  physicallyPressedKey?: string;
  showHands?: boolean;
  showFingerColors?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const AnimatedKeyboardWithHands: React.FC<AnimatedKeyboardWithHandsProps> = ({
  activeChar = '',
  physicallyPressedKey = '',
  showHands = true,
  showFingerColors = true,
  className = '',
  theme = 'dark',
}) => {
  const isShift = requiresShift(activeChar);
  const shiftHand = getShiftHand(activeChar);
  const targetKey = useMemo(() => findKeyForChar(activeChar), [activeChar]);
  const activeFinger = useMemo(() => (activeChar ? getFingerForKey(activeChar) : null), [activeChar]);

  // Determine which keys are physically pressed
  const isKeyPhysicallyPressed = (key: KeyLayoutItem): boolean => {
    if (!physicallyPressedKey) return false;
    const pressedLower = physicallyPressedKey.toLowerCase();
    if (physicallyPressedKey === ' ' && key.id === 'Space') return true;
    if (key.primary.toLowerCase() === pressedLower) return true;
    if (key.shift && key.shift.toLowerCase() === pressedLower) return true;
    if (key.id.toLowerCase() === pressedLower) return true;
    return false;
  };

  // Determine which shift key is required
  const isShiftKeyRequired = (keyId: string): boolean => {
    if (!isShift) return false;
    if (keyId === 'ShiftLeft' && shiftHand === 'left') return true;
    if (keyId === 'ShiftRight' && shiftHand === 'right') return true;
    return false;
  };

  // Compute dynamic tip coordinates for each finger based on activeChar
  const fingerTipPositions = useMemo(() => {
    const pos: Record<FingerId, { x: number; y: number; isActive: boolean; isShiftHold: boolean }> = {
      'left-pinky': { ...HOME_FINGER_POSITIONS['left-pinky'], isActive: false, isShiftHold: false },
      'left-ring': { ...HOME_FINGER_POSITIONS['left-ring'], isActive: false, isShiftHold: false },
      'left-middle': { ...HOME_FINGER_POSITIONS['left-middle'], isActive: false, isShiftHold: false },
      'left-index': { ...HOME_FINGER_POSITIONS['left-index'], isActive: false, isShiftHold: false },
      'thumb': { ...HOME_FINGER_POSITIONS['thumb'], isActive: false, isShiftHold: false },
      'right-index': { ...HOME_FINGER_POSITIONS['right-index'], isActive: false, isShiftHold: false },
      'right-middle': { ...HOME_FINGER_POSITIONS['right-middle'], isActive: false, isShiftHold: false },
      'right-ring': { ...HOME_FINGER_POSITIONS['right-ring'], isActive: false, isShiftHold: false },
      'right-pinky': { ...HOME_FINGER_POSITIONS['right-pinky'], isActive: false, isShiftHold: false },
    };

    // If shift is needed, extend opposite pinky to Shift
    if (isShift) {
      if (shiftHand === 'left') {
        pos['left-pinky'] = { x: 77, y: 194, isActive: false, isShiftHold: true };
      } else if (shiftHand === 'right') {
        pos['right-pinky'] = { x: 785, y: 194, isActive: false, isShiftHold: true };
      }
    }

    // Move target finger to target key
    if (targetKey && activeFinger) {
      const fid = activeFinger.id;
      pos[fid] = {
        x: targetKey.x,
        y: targetKey.y,
        isActive: true,
        isShiftHold: pos[fid]?.isShiftHold || false,
      };
    }

    return pos;
  }, [targetKey, activeFinger, isShift, shiftHand]);

  // Knuckle bases for Left Hand (anchors near palm top)
  const leftKnuckles = {
    pinky: { x: 145, y: 220 },
    ring: { x: 195, y: 215 },
    middle: { x: 250, y: 215 },
    index: { x: 305, y: 220 },
    thumb: { x: 335, y: 250 },
  };

  // Knuckle bases for Right Hand
  const rightKnuckles = {
    thumb: { x: 440, y: 250 },
    index: { x: 475, y: 220 },
    middle: { x: 530, y: 215 },
    ring: { x: 585, y: 215 },
    pinky: { x: 635, y: 220 },
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full max-w-[940px] mx-auto select-none ${className}`}>
      <svg
        viewBox={`0 0 ${KEYBOARD_WIDTH} ${KEYBOARD_HEIGHT + 30}`}
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Key Gradients */}
          <linearGradient id="keyBaseDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="keyBaseLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          <linearGradient id="keyActiveGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="keyPressedGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Realistic Hand Gradients */}
          <linearGradient id="handSkinLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCE7D6" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#F3D2B8" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#E2BA9B" stopOpacity="0.80" />
          </linearGradient>
          <linearGradient id="handSkinRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCE7D6" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#F3D2B8" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#E2BA9B" stopOpacity="0.80" />
          </linearGradient>

          {/* Finger Nail Gradient */}
          <linearGradient id="fingerNail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF5EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F7DFD0" stopOpacity="0.75" />
          </linearGradient>

          {/* Subtle Shadow Filter for Keycaps */}
          <filter id="keyShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Keyboard Chassis Base */}
        <rect
          x="10"
          y="6"
          width={KEYBOARD_WIDTH - 20}
          height={KEYBOARD_HEIGHT - 12}
          rx="18"
          fill={isDark ? '#0A0E17' : '#E2E8F0'}
          stroke={isDark ? '#1E293B' : '#CBD5E1'}
          strokeWidth="2.5"
        />

        {/* ----------------- 1. KEYCAPS ----------------- */}
        <g id="keys-layer">
          {ALL_KEY_ITEMS.map((key) => {
            const isTarget = targetKey?.id === key.id;
            const isShiftActive = isShiftKeyRequired(key.id);
            const isPressed = isKeyPhysicallyPressed(key);
            const finger = FINGER_DATA[key.fingerId];

            const keyLeft = key.x - key.width / 2;
            const keyTop = key.y - key.height / 2;

            let fill = isDark ? 'url(#keyBaseDark)' : 'url(#keyBaseLight)';
            let stroke = isDark ? '#334155' : '#CBD5E1';
            let strokeWidth = '1';
            let textColor = isDark ? '#E2E8F0' : '#1E293B';
            let labelFontWeight = '600';

            if (isPressed) {
              fill = 'url(#keyPressedGlow)';
              stroke = '#34D399';
              strokeWidth = '2';
              textColor = '#FFFFFF';
            } else if (isTarget || isShiftActive) {
              fill = 'url(#keyActiveGlow)';
              stroke = '#60A5FA';
              strokeWidth = '2';
              textColor = '#FFFFFF';
              labelFontWeight = '700';
            }

            return (
              <g
                key={key.id}
                className="transition-all duration-75"
                transform={isPressed ? `translate(0, 2)` : undefined}
                filter="url(#keyShadow)"
              >
                {/* Keycap Shape */}
                <rect
                  x={keyLeft}
                  y={keyTop}
                  width={key.width}
                  height={key.height}
                  rx="7"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />

                {/* Finger Accent Underline or Dot */}
                {showFingerColors && !isPressed && !isTarget && !isShiftActive && finger && (
                  <rect
                    x={keyLeft + 6}
                    y={keyTop + key.height - 4}
                    width={key.width - 12}
                    height="2"
                    rx="1"
                    fill={finger.colorHex}
                    opacity="0.8"
                  />
                )}

                {/* Home Anchor Bumps on F and J */}
                {key.isHomeAnchor && (
                  <rect
                    x={key.x - 6}
                    y={key.y + 13}
                    width="12"
                    height="2"
                    rx="1"
                    fill={isTarget || isPressed ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                  />
                )}

                {/* Key Labels */}
                {key.shift && (
                  <text
                    x={key.x}
                    y={key.y - 7}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="500"
                    fill={isTarget || isPressed ? '#E0F2FE' : isDark ? '#64748B' : '#94A3B8'}
                    fontFamily="ui-monospace, monospace"
                  >
                    {key.shift}
                  </text>
                )}
                <text
                  x={key.x}
                  y={key.shift ? key.y + 9 : key.y + 4}
                  textAnchor="middle"
                  fontSize={key.primary.length > 3 ? '11' : '14'}
                  fontWeight={labelFontWeight}
                  fill={textColor}
                  fontFamily="ui-monospace, monospace"
                >
                  {key.primary}
                </text>
              </g>
            );
          })}
        </g>

        {/* ----------------- 2. ANIMATED TOUCH-TYPING HANDS ----------------- */}
        {showHands && (
          <g id="hands-layer" className="pointer-events-none">
            {/* ================= LEFT HAND ================= */}
            <g id="left-hand" className="transition-all duration-150">
              {/* Left Palm Base & Wrist */}
              <path
                d="M170 330 C190 270 200 240 230 235 C270 230 310 245 330 280 C340 300 340 330 335 330 Z"
                fill="url(#handSkinLeft)"
                stroke="#C69E7B"
                strokeWidth="1.5"
                opacity="0.9"
              />

              {/* Left Hand Palm Contour crease */}
              <path
                d="M210 255 C240 260 270 255 295 245"
                fill="none"
                stroke="#C69E7B"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Left Thumb -> Space */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${leftKnuckles.thumb.x} ${leftKnuckles.thumb.y} Q ${
                    (leftKnuckles.thumb.x + fingerTipPositions.thumb.x) / 2 + 10
                  } ${(leftKnuckles.thumb.y + fingerTipPositions.thumb.y) / 2} ${
                    fingerTipPositions.thumb.x
                  } ${fingerTipPositions.thumb.y}`}
                  fill="none"
                  stroke="url(#handSkinLeft)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions.thumb.x}
                  cy={fingerTipPositions.thumb.y}
                  r="10"
                  fill="url(#handSkinLeft)"
                  stroke="#C69E7B"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx={fingerTipPositions.thumb.x - 1}
                  cy={fingerTipPositions.thumb.y - 2}
                  rx="6"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
              </g>

              {/* Left Index Finger -> Key F or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${leftKnuckles.index.x} ${leftKnuckles.index.y} Q ${
                    (leftKnuckles.index.x + fingerTipPositions['left-index'].x) / 2
                  } ${(leftKnuckles.index.y + fingerTipPositions['left-index'].y) / 2} ${
                    fingerTipPositions['left-index'].x
                  } ${fingerTipPositions['left-index'].y}`}
                  fill="none"
                  stroke="url(#handSkinLeft)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['left-index'].x}
                  cy={fingerTipPositions['left-index'].y}
                  r="9"
                  fill="url(#handSkinLeft)"
                  stroke={fingerTipPositions['left-index'].isActive ? '#3B82F6' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['left-index'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['left-index'].x}
                  cy={fingerTipPositions['left-index'].y - 2}
                  rx="5"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['left-index'].isActive && (
                  <circle
                    cx={fingerTipPositions['left-index'].x}
                    cy={fingerTipPositions['left-index'].y}
                    r="14"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Left Middle Finger -> Key D or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${leftKnuckles.middle.x} ${leftKnuckles.middle.y} Q ${
                    (leftKnuckles.middle.x + fingerTipPositions['left-middle'].x) / 2
                  } ${(leftKnuckles.middle.y + fingerTipPositions['left-middle'].y) / 2} ${
                    fingerTipPositions['left-middle'].x
                  } ${fingerTipPositions['left-middle'].y}`}
                  fill="none"
                  stroke="url(#handSkinLeft)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['left-middle'].x}
                  cy={fingerTipPositions['left-middle'].y}
                  r="9"
                  fill="url(#handSkinLeft)"
                  stroke={fingerTipPositions['left-middle'].isActive ? '#10B981' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['left-middle'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['left-middle'].x}
                  cy={fingerTipPositions['left-middle'].y - 2}
                  rx="5"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['left-middle'].isActive && (
                  <circle
                    cx={fingerTipPositions['left-middle'].x}
                    cy={fingerTipPositions['left-middle'].y}
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Left Ring Finger -> Key S or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${leftKnuckles.ring.x} ${leftKnuckles.ring.y} Q ${
                    (leftKnuckles.ring.x + fingerTipPositions['left-ring'].x) / 2
                  } ${(leftKnuckles.ring.y + fingerTipPositions['left-ring'].y) / 2} ${
                    fingerTipPositions['left-ring'].x
                  } ${fingerTipPositions['left-ring'].y}`}
                  fill="none"
                  stroke="url(#handSkinLeft)"
                  strokeWidth="17"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['left-ring'].x}
                  cy={fingerTipPositions['left-ring'].y}
                  r="8.5"
                  fill="url(#handSkinLeft)"
                  stroke={fingerTipPositions['left-ring'].isActive ? '#F59E0B' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['left-ring'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['left-ring'].x}
                  cy={fingerTipPositions['left-ring'].y - 2}
                  rx="4.5"
                  ry="3.5"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['left-ring'].isActive && (
                  <circle
                    cx={fingerTipPositions['left-ring'].x}
                    cy={fingerTipPositions['left-ring'].y}
                    r="13.5"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Left Pinky -> Key A or ShiftLeft */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${leftKnuckles.pinky.x} ${leftKnuckles.pinky.y} Q ${
                    (leftKnuckles.pinky.x + fingerTipPositions['left-pinky'].x) / 2
                  } ${(leftKnuckles.pinky.y + fingerTipPositions['left-pinky'].y) / 2} ${
                    fingerTipPositions['left-pinky'].x
                  } ${fingerTipPositions['left-pinky'].y}`}
                  fill="none"
                  stroke="url(#handSkinLeft)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['left-pinky'].x}
                  cy={fingerTipPositions['left-pinky'].y}
                  r="7.5"
                  fill="url(#handSkinLeft)"
                  stroke={
                    fingerTipPositions['left-pinky'].isActive
                      ? '#EF4444'
                      : fingerTipPositions['left-pinky'].isShiftHold
                      ? '#F59E0B'
                      : '#C69E7B'
                  }
                  strokeWidth={
                    fingerTipPositions['left-pinky'].isActive || fingerTipPositions['left-pinky'].isShiftHold
                      ? '2.5'
                      : '1.2'
                  }
                />
                <ellipse
                  cx={fingerTipPositions['left-pinky'].x}
                  cy={fingerTipPositions['left-pinky'].y - 2}
                  rx="4"
                  ry="3"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {(fingerTipPositions['left-pinky'].isActive || fingerTipPositions['left-pinky'].isShiftHold) && (
                  <circle
                    cx={fingerTipPositions['left-pinky'].x}
                    cy={fingerTipPositions['left-pinky'].y}
                    r="12"
                    fill="none"
                    stroke={fingerTipPositions['left-pinky'].isShiftHold ? '#F59E0B' : '#EF4444'}
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>
            </g>

            {/* ================= RIGHT HAND ================= */}
            <g id="right-hand" className="transition-all duration-150">
              {/* Right Palm Base & Wrist */}
              <path
                d="M730 330 C710 270 700 240 670 235 C630 230 590 245 570 280 C560 300 560 330 565 330 Z"
                fill="url(#handSkinRight)"
                stroke="#C69E7B"
                strokeWidth="1.5"
                opacity="0.9"
              />

              {/* Right Palm Crease */}
              <path
                d="M690 255 C660 260 630 255 605 245"
                fill="none"
                stroke="#C69E7B"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Right Thumb -> Space */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${rightKnuckles.thumb.x} ${rightKnuckles.thumb.y} Q ${
                    (rightKnuckles.thumb.x + fingerTipPositions.thumb.x) / 2 - 10
                  } ${(rightKnuckles.thumb.y + fingerTipPositions.thumb.y) / 2} ${
                    fingerTipPositions.thumb.x
                  } ${fingerTipPositions.thumb.y}`}
                  fill="none"
                  stroke="url(#handSkinRight)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions.thumb.x}
                  cy={fingerTipPositions.thumb.y}
                  r="10"
                  fill="url(#handSkinRight)"
                  stroke="#C69E7B"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx={fingerTipPositions.thumb.x + 1}
                  cy={fingerTipPositions.thumb.y - 2}
                  rx="6"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
              </g>

              {/* Right Index Finger -> Key J or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${rightKnuckles.index.x} ${rightKnuckles.index.y} Q ${
                    (rightKnuckles.index.x + fingerTipPositions['right-index'].x) / 2
                  } ${(rightKnuckles.index.y + fingerTipPositions['right-index'].y) / 2} ${
                    fingerTipPositions['right-index'].x
                  } ${fingerTipPositions['right-index'].y}`}
                  fill="none"
                  stroke="url(#handSkinRight)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['right-index'].x}
                  cy={fingerTipPositions['right-index'].y}
                  r="9"
                  fill="url(#handSkinRight)"
                  stroke={fingerTipPositions['right-index'].isActive ? '#3B82F6' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['right-index'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['right-index'].x}
                  cy={fingerTipPositions['right-index'].y - 2}
                  rx="5"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['right-index'].isActive && (
                  <circle
                    cx={fingerTipPositions['right-index'].x}
                    cy={fingerTipPositions['right-index'].y}
                    r="14"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Right Middle Finger -> Key K or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${rightKnuckles.middle.x} ${rightKnuckles.middle.y} Q ${
                    (rightKnuckles.middle.x + fingerTipPositions['right-middle'].x) / 2
                  } ${(rightKnuckles.middle.y + fingerTipPositions['right-middle'].y) / 2} ${
                    fingerTipPositions['right-middle'].x
                  } ${fingerTipPositions['right-middle'].y}`}
                  fill="none"
                  stroke="url(#handSkinRight)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['right-middle'].x}
                  cy={fingerTipPositions['right-middle'].y}
                  r="9"
                  fill="url(#handSkinRight)"
                  stroke={fingerTipPositions['right-middle'].isActive ? '#8B5CF6' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['right-middle'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['right-middle'].x}
                  cy={fingerTipPositions['right-middle'].y - 2}
                  rx="5"
                  ry="4"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['right-middle'].isActive && (
                  <circle
                    cx={fingerTipPositions['right-middle'].x}
                    cy={fingerTipPositions['right-middle'].y}
                    r="14"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Right Ring Finger -> Key L or target */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${rightKnuckles.ring.x} ${rightKnuckles.ring.y} Q ${
                    (rightKnuckles.ring.x + fingerTipPositions['right-ring'].x) / 2
                  } ${(rightKnuckles.ring.y + fingerTipPositions['right-ring'].y) / 2} ${
                    fingerTipPositions['right-ring'].x
                  } ${fingerTipPositions['right-ring'].y}`}
                  fill="none"
                  stroke="url(#handSkinRight)"
                  strokeWidth="17"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['right-ring'].x}
                  cy={fingerTipPositions['right-ring'].y}
                  r="8.5"
                  fill="url(#handSkinRight)"
                  stroke={fingerTipPositions['right-ring'].isActive ? '#C026D3' : '#C69E7B'}
                  strokeWidth={fingerTipPositions['right-ring'].isActive ? '2.5' : '1.2'}
                />
                <ellipse
                  cx={fingerTipPositions['right-ring'].x}
                  cy={fingerTipPositions['right-ring'].y - 2}
                  rx="4.5"
                  ry="3.5"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {fingerTipPositions['right-ring'].isActive && (
                  <circle
                    cx={fingerTipPositions['right-ring'].x}
                    cy={fingerTipPositions['right-ring'].y}
                    r="13.5"
                    fill="none"
                    stroke="#C026D3"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Right Pinky -> Key ; or ShiftRight / Enter / Backspace */}
              <g className="transition-all duration-100 ease-out">
                <path
                  d={`M${rightKnuckles.pinky.x} ${rightKnuckles.pinky.y} Q ${
                    (rightKnuckles.pinky.x + fingerTipPositions['right-pinky'].x) / 2
                  } ${(rightKnuckles.pinky.y + fingerTipPositions['right-pinky'].y) / 2} ${
                    fingerTipPositions['right-pinky'].x
                  } ${fingerTipPositions['right-pinky'].y}`}
                  fill="none"
                  stroke="url(#handSkinRight)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle
                  cx={fingerTipPositions['right-pinky'].x}
                  cy={fingerTipPositions['right-pinky'].y}
                  r="7.5"
                  fill="url(#handSkinRight)"
                  stroke={
                    fingerTipPositions['right-pinky'].isActive
                      ? '#14B8A6'
                      : fingerTipPositions['right-pinky'].isShiftHold
                      ? '#F59E0B'
                      : '#C69E7B'
                  }
                  strokeWidth={
                    fingerTipPositions['right-pinky'].isActive || fingerTipPositions['right-pinky'].isShiftHold
                      ? '2.5'
                      : '1.2'
                  }
                />
                <ellipse
                  cx={fingerTipPositions['right-pinky'].x}
                  cy={fingerTipPositions['right-pinky'].y - 2}
                  rx="4"
                  ry="3"
                  fill="url(#fingerNail)"
                  stroke="#D4A373"
                  strokeWidth="0.8"
                />
                {(fingerTipPositions['right-pinky'].isActive || fingerTipPositions['right-pinky'].isShiftHold) && (
                  <circle
                    cx={fingerTipPositions['right-pinky'].x}
                    cy={fingerTipPositions['right-pinky'].y}
                    r="12"
                    fill="none"
                    stroke={fingerTipPositions['right-pinky'].isShiftHold ? '#F59E0B' : '#14B8A6'}
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
              </g>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
