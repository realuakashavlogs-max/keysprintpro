/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ALL_KEY_ITEMS,
  KEYBOARD_HEIGHT,
  KEYBOARD_WIDTH,
  KeyLayoutItem,
  findKeyForChar,
} from '../data/keyCoordinates';
import { FINGER_DATA } from '../data/fingerMapping';
import { getShiftGuidance } from '../utils/fingerAnimationLogic';
import { HandRenderer, AnimPhase } from './HandRenderer';

export interface AnimatedKeyboardWithHandsProps {
  activeChar: string;
  physicallyPressedKey?: string;
  errorKey?: string;
  showHands?: boolean;
  showFingerColors?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const AnimatedKeyboardWithHands: React.FC<AnimatedKeyboardWithHandsProps> = ({
  activeChar,
  physicallyPressedKey = '',
  errorKey = '',
  showHands = true,
  showFingerColors = true,
  theme = 'light',
  className = '',
}) => {
  // 4-Phase Animation State Loop
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const [demoKeyDepressed, setDemoKeyDepressed] = useState<boolean>(false);

  // Normalize key lookup
  const targetKey: KeyLayoutItem | undefined = findKeyForChar(activeChar);

  const shiftGuidance = getShiftGuidance(activeChar);

  // Check if Shift key is active
  const isShiftKeyRequired = (keyId: string) => {
    if (!shiftGuidance.needsShift) return false;
    if (shiftGuidance.shiftHand === 'left' && keyId === 'ShiftLeft') return true;
    if (shiftGuidance.shiftHand === 'right' && keyId === 'ShiftRight') return true;
    return false;
  };

  // Run visible 4-phase demonstration loop when target character changes
  useEffect(() => {
    if (!activeChar) {
      setAnimPhase('idle');
      setDemoKeyDepressed(false);
      return;
    }

    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;

    const startDemoCycle = () => {
      // 1. Reaching toward target key
      setAnimPhase('reaching');
      setDemoKeyDepressed(false);

      // 2. Pressing down onto keycap
      t1 = setTimeout(() => {
        setAnimPhase('pressing');
        setDemoKeyDepressed(true);
      }, 190);

      // 3. Releasing and returning toward home row
      t2 = setTimeout(() => {
        setAnimPhase('returning');
        setDemoKeyDepressed(false);
      }, 380);

      // 4. Back at resting position
      t3 = setTimeout(() => {
        setAnimPhase('idle');
      }, 590);
    };

    startDemoCycle();

    // Subtle re-demonstration reminder every 3.6 seconds if user is still thinking
    const interval = setInterval(() => {
      if (!physicallyPressedKey) {
        startDemoCycle();
      }
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [activeChar, physicallyPressedKey]);

  // Physical press detection
  const isKeyPhysicallyPressed = (key: KeyLayoutItem) => {
    if (!physicallyPressedKey) return false;
    if (key.id === physicallyPressedKey) return true;
    if (physicallyPressedKey === ' ' && key.id === 'Space') return true;
    if (key.primary.toLowerCase() === physicallyPressedKey.toLowerCase()) return true;
    if (key.shift && key.shift === physicallyPressedKey) return true;
    return false;
  };

  // Error press detection
  const isKeyError = (key: KeyLayoutItem) => {
    if (!errorKey) return false;
    if (key.id === errorKey) return true;
    if (errorKey === ' ' && key.id === 'Space') return true;
    if (key.primary.toLowerCase() === errorKey.toLowerCase()) return true;
    if (key.shift && key.shift === errorKey) return true;
    return false;
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full max-w-[940px] mx-auto select-none ${className}`}>
      <svg
        viewBox={`0 0 ${KEYBOARD_WIDTH} ${KEYBOARD_HEIGHT + 30}`}
        className="w-full h-auto max-h-[38vh] sm:max-h-[42vh] mx-auto drop-shadow-xl overflow-visible block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Keycap Gradients */}
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

          <linearGradient id="keyErrorGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Key Shadow Filter */}
          <filter id="keyShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
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

        {/* ----------------- 1. BASE KEYCAPS LAYER ----------------- */}
        <g id="keys-layer">
          {ALL_KEY_ITEMS.map((key) => {
            const isTarget = targetKey?.id === key.id;
            const isShiftActive = isShiftKeyRequired(key.id);
            const isPhysPressed = isKeyPhysicallyPressed(key);
            const isErr = isKeyError(key);
            const isDemoPress = isTarget && demoKeyDepressed;
            const isDepressed = isPhysPressed || isDemoPress || (isShiftActive && animPhase === 'pressing');

            const finger = FINGER_DATA[key.fingerId];
            const keyLeft = key.x - key.width / 2;
            const keyTop = key.y - key.height / 2;

            let fill = isDark ? 'url(#keyBaseDark)' : 'url(#keyBaseLight)';
            let stroke = isDark ? '#334155' : '#CBD5E1';
            let strokeWidth = '1';
            let textColor = isDark ? '#E2E8F0' : '#1E293B';
            let labelFontWeight = '600';

            if (isErr) {
              fill = 'url(#keyErrorGlow)';
              stroke = '#DC2626';
              strokeWidth = '2';
              textColor = '#FFFFFF';
            } else if (isPhysPressed) {
              fill = 'url(#keyPressedGlow)';
              stroke = '#34D399';
              strokeWidth = '2';
              textColor = '#FFFFFF';
              labelFontWeight = '700';
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
                className="transition-all duration-100 ease-out"
                transform={isDepressed ? `translate(0, 3)` : undefined}
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
                {showFingerColors && !isDepressed && !isTarget && !isShiftActive && finger && (
                  <rect
                    x={keyLeft + 6}
                    y={keyTop + key.height - 4}
                    width={key.width - 12}
                    height="2"
                    rx="1"
                    fill={finger.colorHex}
                    opacity="0.85"
                  />
                )}

                {/* Home Anchor Bumps on F and J */}
                {key.isHomeAnchor && (
                  <rect
                    x={key.x - 6}
                    y={key.y + 13}
                    width="12"
                    height="2.5"
                    rx="1.25"
                    fill={isTarget || isDepressed ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                  />
                )}

                {/* Shifted Label */}
                {key.shift && (
                  <text
                    x={key.x}
                    y={key.y - 7}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="500"
                    fill={isTarget || isDepressed ? '#E0F2FE' : isDark ? '#647184' : '#94A3B8'}
                    fontFamily="ui-monospace, monospace"
                  >
                    {key.shift}
                  </text>
                )}

                {/* Primary Key Label */}
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

        {/* ----------------- 2. REALISTIC HUMAN HANDS LAYER ----------------- */}
        <HandRenderer
          activeChar={activeChar}
          physicallyPressedKey={physicallyPressedKey}
          errorKey={errorKey}
          showHands={showHands}
          theme={theme}
          animPhase={animPhase}
          demoKeyDepressed={demoKeyDepressed}
        />

        {/* ----------------- 3. ACTIVE TARGET KEY ELEVATED OVERLAY ----------------- */}
        {/* Guarantees that the active target key & label are never obscured by hands */}
        {targetKey && (
          <g
            id="active-target-overlay"
            className="pointer-events-none transition-all duration-100 ease-out"
            transform={demoKeyDepressed || !!physicallyPressedKey ? `translate(0, 3)` : undefined}
          >
            <rect
              x={targetKey.x - targetKey.width / 2}
              y={targetKey.y - targetKey.height / 2}
              width={targetKey.width}
              height={targetKey.height}
              rx="7"
              fill="url(#keyActiveGlow)"
              stroke="#93C5FD"
              strokeWidth="2.5"
              filter="url(#keyShadow)"
              opacity="0.95"
            />
            {targetKey.shift && (
              <text
                x={targetKey.x}
                y={targetKey.y - 7}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#E0F2FE"
                fontFamily="ui-monospace, monospace"
              >
                {targetKey.shift}
              </text>
            )}
            <text
              x={targetKey.x}
              y={targetKey.shift ? targetKey.y + 9 : targetKey.y + 4}
              textAnchor="middle"
              fontSize={targetKey.primary.length > 3 ? '11' : '14'}
              fontWeight="800"
              fill="#FFFFFF"
              fontFamily="ui-monospace, monospace"
            >
              {targetKey.primary}
            </text>
          </g>
        )}

        {/* Error Key Elevated Overlay (if an incorrect key was pressed) */}
        {errorKey && (
          (() => {
            const errKeyItem = ALL_KEY_ITEMS.find(
              (k) =>
                k.id === errorKey ||
                (errorKey === ' ' && k.id === 'Space') ||
                k.primary.toLowerCase() === errorKey.toLowerCase()
            );
            if (!errKeyItem) return null;
            return (
              <g
                id="error-key-overlay"
                className="pointer-events-none"
                transform="translate(0, 3)"
              >
                <rect
                  x={errKeyItem.x - errKeyItem.width / 2}
                  y={errKeyItem.y - errKeyItem.height / 2}
                  width={errKeyItem.width}
                  height={errKeyItem.height}
                  rx="7"
                  fill="url(#keyErrorGlow)"
                  stroke="#F87171"
                  strokeWidth="2.5"
                  filter="url(#keyShadow)"
                />
                <text
                  x={errKeyItem.x}
                  y={errKeyItem.y + 4}
                  textAnchor="middle"
                  fontSize={errKeyItem.primary.length > 3 ? '11' : '14'}
                  fontWeight="800"
                  fill="#FFFFFF"
                  fontFamily="ui-monospace, monospace"
                >
                  {errKeyItem.primary}
                </text>
              </g>
            );
          })()
        )}
      </svg>
    </div>
  );
};
