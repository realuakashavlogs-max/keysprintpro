/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FingerId } from '../types/typing';
import { getFingerForKey } from '../data/fingerMapping';
import { findKeyForChar } from '../data/keyCoordinates';
import {
  calculateFingerReach,
  getShiftGuidance,
} from '../utils/fingerAnimationLogic';

export type AnimPhase = 'idle' | 'reaching' | 'pressing' | 'returning';

export interface HandRendererProps {
  activeChar: string;
  physicallyPressedKey?: string;
  errorKey?: string;
  showHands: boolean;
  theme?: 'light' | 'dark';
  animPhase: AnimPhase;
  demoKeyDepressed?: boolean;
}

// Calibrated placement metrics aligning 1024x1024 photorealistic hand cutouts
// perfectly with home row keys (ASDF and JKL;)
export const HAND_ALIGNMENT = {
  left: {
    x: -8,
    y: 68,
    width: 516,
    height: 516,
    wristX: 245,
    wristY: 300,
    fingerCenters: {
      pinky: { cx: 140, cy: 140 }, // Key A
      ring: { cx: 196, cy: 140 }, // Key S
      middle: { cx: 252, cy: 140 }, // Key D
      index: { cx: 308, cy: 140 }, // Key F
      thumb: { cx: 368, cy: 244 }, // Spacebar (left side)
    },
  },
  right: {
    x: 260,
    y: 58,
    width: 550,
    height: 550,
    wristX: 538,
    wristY: 300,
    fingerCenters: {
      thumb: { cx: 412, cy: 244 }, // Spacebar (right side)
      index: { cx: 476, cy: 140 }, // Key J
      middle: { cx: 532, cy: 140 }, // Key K
      ring: { cx: 588, cy: 140 }, // Key L
      pinky: { cx: 644, cy: 140 }, // Key ;
    },
  },
};

export const HandRenderer: React.FC<HandRendererProps> = ({
  activeChar,
  physicallyPressedKey,
  errorKey: _errorKey,
  showHands,
  animPhase,
}) => {
  if (!showHands) return null;

  const fingerInfo = activeChar ? getFingerForKey(activeChar) : null;
  const targetKey = findKeyForChar(activeChar);
  const reach = fingerInfo
    ? calculateFingerReach(fingerInfo.id, targetKey)
    : { reachX: 0, reachY: 0, isHomeKey: true, fingerId: 'left-index' as FingerId };
  const shiftGuidance = getShiftGuidance(activeChar);

  // Helper calculating transform for each individual finger layer
  const getFingerTransform = (
    hand: 'left' | 'right',
    fingerName: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'
  ) => {
    const isTargetFinger =
      !!fingerInfo &&
      (fingerInfo.hand === hand || fingerInfo.id === 'thumb') &&
      (fingerInfo.id === `${hand}-${fingerName}` || (fingerInfo.id === 'thumb' && fingerName === 'thumb'));

    const isShiftPinky =
      shiftGuidance.needsShift &&
      shiftGuidance.shiftHand === hand &&
      fingerName === 'pinky';

    const isPhysPressed = !!physicallyPressedKey && isTargetFinger;

    // Resting state: stationary over home row
    if (!isTargetFinger && !isShiftPinky) {
      return {
        transform: 'translate(0, 0) scale(1)',
        isMoving: false,
        isPressing: false,
        highlightColor: '',
      };
    }

    // 1. Shift pinky motion toward ShiftLeft / ShiftRight
    if (isShiftPinky) {
      const dx = hand === 'left' ? -63 : 141;
      const dy = 54;
      const isShiftActive =
        animPhase === 'reaching' || animPhase === 'pressing' || !!physicallyPressedKey;

      return {
        transform: isShiftActive
          ? `translate(${dx}, ${dy}) scale(0.97)`
          : 'translate(0, 0) scale(1)',
        isMoving: isShiftActive,
        isPressing: isShiftActive,
        highlightColor: '#F59E0B',
      };
    }

    // 2. Primary target finger reaching and pressing
    if (isTargetFinger) {
      const rx = reach.reachX;
      const ry = reach.reachY;
      const color = hand === 'left' ? '#315CE8' : '#117C78';

      // Immediate physical tap response
      if (isPhysPressed) {
        return {
          transform: `translate(${rx}, ${ry + 3.5}) scale(0.96)`,
          isMoving: true,
          isPressing: true,
          highlightColor: '#34D399',
        };
      }

      // Demonstration loop states
      if (animPhase === 'reaching') {
        return {
          transform: `translate(${rx}, ${ry}) scale(1.02)`,
          isMoving: true,
          isPressing: false,
          highlightColor: color,
        };
      }

      if (animPhase === 'pressing') {
        return {
          transform: `translate(${rx}, ${ry + 3.5}) scale(0.96)`,
          isMoving: true,
          isPressing: true,
          highlightColor: color,
        };
      }

      if (animPhase === 'returning') {
        return {
          transform: `translate(${rx * 0.35}, ${ry * 0.35}) scale(1)`,
          isMoving: true,
          isPressing: false,
          highlightColor: color,
        };
      }

      // Resting state
      return {
        transform: 'translate(0, 0) scale(1)',
        isMoving: false,
        isPressing: false,
        highlightColor: color,
      };
    }

    return {
      transform: 'translate(0, 0) scale(1)',
      isMoving: false,
      isPressing: false,
      highlightColor: '',
    };
  };

  const leftCfg = HAND_ALIGNMENT.left;
  const rightCfg = HAND_ALIGNMENT.right;

  return (
    <g id="hands-animation-layer" className="pointer-events-none select-none">
      {/* ================= LEFT HAND ================= */}
      <g id="left-hand-system">
        {/* Left Palm Base (opaque, natural skin, anchored over home row and wrist) */}
        <image
          href="/hands/fingers/left_palm.png"
          x={leftCfg.x}
          y={leftCfg.y}
          width={leftCfg.width}
          height={leftCfg.height}
          opacity="0.94"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Left Pinky (Finger 1) -> Reaches Q, A, Z, 1, Tab, Caps, Shift */}
        {(() => {
          const anim = getFingerTransform('left', 'pinky');
          const center = leftCfg.fingerCenters.pinky;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '280px 240px',
              }}
            >
              <image
                href="/hands/fingers/left_pinky.png"
                x={leftCfg.x}
                y={leftCfg.y}
                width={leftCfg.width}
                height={leftCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Left Ring (Finger 2) -> Reaches W, S, X, 2 */}
        {(() => {
          const anim = getFingerTransform('left', 'ring');
          const center = leftCfg.fingerCenters.ring;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '330px 240px',
              }}
            >
              <image
                href="/hands/fingers/left_ring.png"
                x={leftCfg.x}
                y={leftCfg.y}
                width={leftCfg.width}
                height={leftCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Left Middle (Finger 3) -> Reaches E, D, C, 3 */}
        {(() => {
          const anim = getFingerTransform('left', 'middle');
          const center = leftCfg.fingerCenters.middle;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '380px 240px',
              }}
            >
              <image
                href="/hands/fingers/left_middle.png"
                x={leftCfg.x}
                y={leftCfg.y}
                width={leftCfg.width}
                height={leftCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Left Index (Finger 4) -> Reaches R, T, F, G, V, B, 4, 5 */}
        {(() => {
          const anim = getFingerTransform('left', 'index');
          const center = leftCfg.fingerCenters.index;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '420px 240px',
              }}
            >
              <image
                href="/hands/fingers/left_index.png"
                x={leftCfg.x}
                y={leftCfg.y}
                width={leftCfg.width}
                height={leftCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="16"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.8"
                  opacity="0.9"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Left Thumb -> Spacebar */}
        {(() => {
          const anim = getFingerTransform('left', 'thumb');
          const center = leftCfg.fingerCenters.thumb;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '420px 280px',
              }}
            >
              <image
                href="/hands/fingers/left_thumb.png"
                x={leftCfg.x}
                y={leftCfg.y}
                width={leftCfg.width}
                height={leftCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="16"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.8"
                  opacity="0.9"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}
      </g>

      {/* ================= RIGHT HAND ================= */}
      <g id="right-hand-system">
        {/* Right Palm Base (opaque, natural skin, anchored over home row and wrist) */}
        <image
          href="/hands/fingers/right_palm.png"
          x={rightCfg.x}
          y={rightCfg.y}
          width={rightCfg.width}
          height={rightCfg.height}
          opacity="0.94"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Right Thumb -> Spacebar */}
        {(() => {
          const anim = getFingerTransform('right', 'thumb');
          const center = rightCfg.fingerCenters.thumb;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '480px 280px',
              }}
            >
              <image
                href="/hands/fingers/right_thumb.png"
                x={rightCfg.x}
                y={rightCfg.y}
                width={rightCfg.width}
                height={rightCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="16"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.8"
                  opacity="0.9"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Right Index (Finger 6) -> Reaches Y, U, H, J, N, M, 6, 7 */}
        {(() => {
          const anim = getFingerTransform('right', 'index');
          const center = rightCfg.fingerCenters.index;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '480px 240px',
              }}
            >
              <image
                href="/hands/fingers/right_index.png"
                x={rightCfg.x}
                y={rightCfg.y}
                width={rightCfg.width}
                height={rightCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="16"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.8"
                  opacity="0.9"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Right Middle (Finger 7) -> Reaches I, K, <, 8 */}
        {(() => {
          const anim = getFingerTransform('right', 'middle');
          const center = rightCfg.fingerCenters.middle;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '530px 240px',
              }}
            >
              <image
                href="/hands/fingers/right_middle.png"
                x={rightCfg.x}
                y={rightCfg.y}
                width={rightCfg.width}
                height={rightCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Right Ring (Finger 8) -> Reaches O, L, >, 9 */}
        {(() => {
          const anim = getFingerTransform('right', 'ring');
          const center = rightCfg.fingerCenters.ring;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '580px 240px',
              }}
            >
              <image
                href="/hands/fingers/right_ring.png"
                x={rightCfg.x}
                y={rightCfg.y}
                width={rightCfg.width}
                height={rightCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}

        {/* Right Pinky (Finger 9) -> Reaches P, ;, /, 0, -, =, [, ], ', Enter */}
        {(() => {
          const anim = getFingerTransform('right', 'pinky');
          const center = rightCfg.fingerCenters.pinky;
          return (
            <g
              transform={anim.transform}
              style={{
                transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1)',
                transformOrigin: '630px 240px',
              }}
            >
              <image
                href="/hands/fingers/right_pinky.png"
                x={rightCfg.x}
                y={rightCfg.y}
                width={rightCfg.width}
                height={rightCfg.height}
                opacity="0.96"
                preserveAspectRatio="xMidYMid meet"
              />
              {anim.isMoving && (
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r="15"
                  fill="none"
                  stroke={anim.highlightColor}
                  strokeWidth="2.5"
                  opacity="0.85"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })()}
      </g>
    </g>
  );
};
