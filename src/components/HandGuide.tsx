/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  getFingerForKey,
  getFingerInstruction,
  getShiftHand,
  requiresShift,
} from '../data/fingerMapping';
import { FingerId } from '../types/typing';

interface HandGuideProps {
  activeChar: string;
  compact?: boolean;
}

export const HandGuide: React.FC<HandGuideProps> = ({ activeChar, compact = false }) => {
  const activeFinger = activeChar ? getFingerForKey(activeChar) : null;
  const isShift = requiresShift(activeChar);
  const shiftHand = getShiftHand(activeChar);
  const info = getFingerInstruction(activeChar);

  // Finger definitions for Left and Right hands with home keys
  const leftFingers: { id: FingerId; name: string; key: string }[] = [
    { id: 'left-pinky', name: 'Pinky', key: 'A' },
    { id: 'left-ring', name: 'Ring', key: 'S' },
    { id: 'left-middle', name: 'Middle', key: 'D' },
    { id: 'left-index', name: 'Index', key: 'F' },
    { id: 'thumb', name: 'Thumb', key: 'Space' },
  ];

  const rightFingers: { id: FingerId; name: string; key: string }[] = [
    { id: 'thumb', name: 'Thumb', key: 'Space' },
    { id: 'right-index', name: 'Index', key: 'J' },
    { id: 'right-middle', name: 'Middle', key: 'K' },
    { id: 'right-ring', name: 'Ring', key: 'L' },
    { id: 'right-pinky', name: 'Pinky', key: ';' },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#E1E7EF] bg-white p-3.5 sm:p-5 shadow-xs select-none">
      {/* 1. Dynamic Hand & Finger Instruction Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-[#E1E7EF]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] border border-[#315CE8]/20 text-[#315CE8] font-mono text-lg font-bold shadow-xs">
            {activeChar === ' ' ? '␣' : activeChar || 'F'}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#647184]">
              {info.handName} • {info.fingerName}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#192230]">
              {info.instruction}
            </h2>
          </div>
        </div>

        {/* Home Row Anchor Badge */}
        <div className="flex items-center gap-2">
          {info.requiresShift && (
            <span className="rounded-lg bg-amber-50 border border-amber-300 px-2.5 py-1 text-xs font-bold text-amber-700 animate-pulse">
              Hold {info.shiftHand === 'left' ? 'Left' : 'Right'} Shift
            </span>
          )}
          <span className="rounded-lg bg-[#F5F7FA] border border-[#E1E7EF] px-2.5 py-1 text-xs font-medium text-[#647184]">
            Rest Anchor: <strong className="text-[#192230] font-mono">{info.homeKey}</strong>
          </span>
        </div>
      </div>

      {/* 2. Real Human Hands Cards (Left & Right) with Real Skin Texture & Synchronized Finger Highlighting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* ================= LEFT HAND CARD ================= */}
        <div className="relative flex flex-col items-center rounded-xl bg-[#F8FAFC] border border-[#E1E7EF] p-3 sm:p-4">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#647184]">
              Left Hand (ASDF)
            </span>
            {isShift && shiftHand === 'left' ? (
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                HOLD SHIFT
              </span>
            ) : (
              <span className="text-[11px] text-[#8692A6]">Anchor: A S D F</span>
            )}
          </div>

          {/* Real Human Left Hand Photographic Asset + SVG Interactive Finger Mask */}
          <div className="relative w-full max-w-[280px] h-[210px] sm:h-[220px] flex items-center justify-center overflow-hidden">
            {/* Real Photographic Human Hand */}
            <img
              src="/hands/left_hand.png"
              alt="Real Human Left Hand Touch Typing Posture"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
              loading="eager"
            />

            {/* Synchronized Finger Highlighting SVG Overlay on 1024x1024 coordinate system */}
            <svg
              viewBox="0 0 1024 1024"
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="leftGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#315CE8" floodOpacity="0.8" />
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#60A5FA" floodOpacity="0.9" />
                </filter>
                <filter id="shiftGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#F59E0B" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* 1. Left Pinky (Finger 1) - Key A or ShiftLeft */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-pinky';
                const isHoldShift = isShift && shiftHand === 'left';
                const isActive = isTarget || isHoldShift;
                const strokeColor = isHoldShift ? '#F59E0B' : '#315CE8';
                const filter = isHoldShift ? 'url(#shiftGlow)' : 'url(#leftGlow)';

                return (
                  <g className="transition-all duration-150">
                    {/* Finger Highlight Contour */}
                    {isActive && (
                      <path
                        d="M 276 340 C 276 270 285 253 308 253 C 330 253 340 270 340 340 L 342 450 C 342 475 276 475 276 450 Z"
                        fill="rgba(49, 92, 232, 0.22)"
                        stroke={strokeColor}
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter={filter}
                      />
                    )}
                    {/* Fingertip Key Badge */}
                    <circle
                      cx="308"
                      cy="285"
                      r={isActive ? "28" : "20"}
                      fill={isActive ? strokeColor : "#FFFFFF"}
                      stroke={isActive ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isActive ? "3" : "2"}
                      className={isActive ? "animate-pulse" : ""}
                    />
                    <text
                      x="308"
                      y="292"
                      textAnchor="middle"
                      fill={isActive ? "#FFFFFF" : "#475569"}
                      fontSize={isActive ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      {isHoldShift ? '⇧' : 'A'}
                    </text>
                  </g>
                );
              })()}

              {/* 2. Left Ring (Finger 2) - Key S */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-ring';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 368 250 C 368 170 378 149 404 149 C 430 149 440 170 440 250 L 442 410 C 442 435 368 435 368 410 Z"
                        fill="rgba(49, 92, 232, 0.22)"
                        stroke="#315CE8"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#leftGlow)"
                      />
                    )}
                    <circle
                      cx="404"
                      cy="185"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#315CE8" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="404"
                      y="192"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      S
                    </text>
                  </g>
                );
              })()}

              {/* 3. Left Middle (Finger 3) - Key D */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-middle';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 452 220 C 452 130 464 104 490 104 C 516 104 528 130 528 220 L 530 405 C 530 430 452 430 452 405 Z"
                        fill="rgba(49, 92, 232, 0.22)"
                        stroke="#315CE8"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#leftGlow)"
                      />
                    )}
                    <circle
                      cx="490"
                      cy="145"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#315CE8" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="490"
                      y="152"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      D
                    </text>
                  </g>
                );
              })()}

              {/* 4. Left Index (Finger 4) - Key F with tactile bump indicator! */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-index';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 560 250 C 560 170 572 146 598 146 C 624 146 636 170 636 250 L 638 420 C 638 445 560 445 560 420 Z"
                        fill="rgba(49, 92, 232, 0.22)"
                        stroke="#315CE8"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#leftGlow)"
                      />
                    )}
                    <circle
                      cx="598"
                      cy="185"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#315CE8" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="598"
                      y="192"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      F
                    </text>
                    {/* Tactile home bump marker line */}
                    <line
                      x1="586"
                      y1="222"
                      x2="610"
                      y2="222"
                      stroke={isTarget ? "#315CE8" : "#8692A6"}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()}

              {/* 5. Left Thumb (Finger 5) - Spacebar */}
              {(() => {
                const isTarget = activeFinger?.id === 'thumb';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 660 430 C 660 360 680 343 715 343 C 748 343 765 365 760 440 L 730 520 C 700 540 660 500 660 430 Z"
                        fill="rgba(49, 92, 232, 0.22)"
                        stroke="#315CE8"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#leftGlow)"
                      />
                    )}
                    <circle
                      cx="715"
                      cy="380"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#315CE8" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="715"
                      y="388"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "20" : "15"}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      ␣
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Left Hand Finger Chips */}
          <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-[#E1E7EF] text-[11px]">
            {leftFingers.map((f) => {
              const isTarget = activeFinger?.id === f.id;
              const isHoldShift = isShift && shiftHand === 'left' && f.id === 'left-pinky';
              return (
                <div
                  key={f.id}
                  className={`flex flex-col items-center px-1.5 py-0.5 rounded-md transition-colors ${
                    isTarget
                      ? 'bg-[#315CE8] text-white font-bold shadow-xs ring-1 ring-[#315CE8]'
                      : isHoldShift
                      ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                      : 'text-[#647184]'
                  }`}
                >
                  <span className="text-[9px] uppercase">{f.name}</span>
                  <span className="font-mono text-[10px] font-semibold">{f.key}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT HAND CARD ================= */}
        <div className="relative flex flex-col items-center rounded-xl bg-[#F8FAFC] border border-[#E1E7EF] p-3 sm:p-4">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#647184]">
              Right Hand (JKL;)
            </span>
            {isShift && shiftHand === 'right' ? (
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                HOLD SHIFT
              </span>
            ) : (
              <span className="text-[11px] text-[#8692A6]">Anchor: J K L ;</span>
            )}
          </div>

          {/* Real Human Right Hand Photographic Asset + SVG Interactive Finger Mask */}
          <div className="relative w-full max-w-[280px] h-[210px] sm:h-[220px] flex items-center justify-center overflow-hidden">
            {/* Real Photographic Human Hand */}
            <img
              src="/hands/right_hand.png"
              alt="Real Human Right Hand Touch Typing Posture"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
              loading="eager"
            />

            {/* Synchronized Finger Highlighting SVG Overlay on 1024x1024 coordinate system */}
            <svg
              viewBox="0 0 1024 1024"
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="rightGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#117C78" floodOpacity="0.8" />
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2DD4BF" floodOpacity="0.9" />
                </filter>
                <filter id="rightShiftGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#F59E0B" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* 6. Right Thumb (Finger 6) - Spacebar */}
              {(() => {
                const isTarget = activeFinger?.id === 'thumb';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 364 430 C 364 360 344 343 309 343 C 276 343 259 365 264 440 L 294 520 C 324 540 364 500 364 430 Z"
                        fill="rgba(17, 124, 120, 0.22)"
                        stroke="#117C78"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#rightGlow)"
                      />
                    )}
                    <circle
                      cx="309"
                      cy="380"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#117C78" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="309"
                      y="388"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "20" : "15"}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      ␣
                    </text>
                  </g>
                );
              })()}

              {/* 7. Right Index (Finger 7) - Key J with tactile bump indicator! */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-index';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 464 250 C 464 170 452 146 426 146 C 400 146 388 170 388 250 L 386 420 C 386 445 464 445 464 420 Z"
                        fill="rgba(17, 124, 120, 0.22)"
                        stroke="#117C78"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#rightGlow)"
                      />
                    )}
                    <circle
                      cx="426"
                      cy="185"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#117C78" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="426"
                      y="192"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      J
                    </text>
                    {/* Tactile home bump marker line */}
                    <line
                      x1="414"
                      y1="222"
                      x2="438"
                      y2="222"
                      stroke={isTarget ? "#117C78" : "#8692A6"}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()}

              {/* 8. Right Middle (Finger 8) - Key K */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-middle';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 572 220 C 572 130 560 104 534 104 C 508 104 496 130 496 220 L 494 405 C 494 430 572 430 572 405 Z"
                        fill="rgba(17, 124, 120, 0.22)"
                        stroke="#117C78"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#rightGlow)"
                      />
                    )}
                    <circle
                      cx="534"
                      cy="145"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#117C78" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="534"
                      y="152"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      K
                    </text>
                  </g>
                );
              })()}

              {/* 9. Right Ring (Finger 9) - Key L */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-ring';

                return (
                  <g className="transition-all duration-150">
                    {isTarget && (
                      <path
                        d="M 656 250 C 656 170 646 149 620 149 C 594 149 584 170 584 250 L 582 410 C 582 435 656 435 656 410 Z"
                        fill="rgba(17, 124, 120, 0.22)"
                        stroke="#117C78"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter="url(#rightGlow)"
                      />
                    )}
                    <circle
                      cx="620"
                      cy="185"
                      r={isTarget ? "28" : "20"}
                      fill={isTarget ? "#117C78" : "#FFFFFF"}
                      stroke={isTarget ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isTarget ? "3" : "2"}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    <text
                      x="620"
                      y="192"
                      textAnchor="middle"
                      fill={isTarget ? "#FFFFFF" : "#475569"}
                      fontSize={isTarget ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      L
                    </text>
                  </g>
                );
              })()}

              {/* 10. Right Pinky (Finger 10) - Key ; or ShiftRight / Enter */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-pinky';
                const isHoldShift = isShift && shiftHand === 'right';
                const isActive = isTarget || isHoldShift;
                const strokeColor = isHoldShift ? '#F59E0B' : '#117C78';
                const filter = isHoldShift ? 'url(#rightShiftGlow)' : 'url(#rightGlow)';

                return (
                  <g className="transition-all duration-150">
                    {isActive && (
                      <path
                        d="M 748 340 C 748 270 739 253 716 253 C 694 253 684 270 684 340 L 682 450 C 682 475 748 475 748 450 Z"
                        fill="rgba(17, 124, 120, 0.22)"
                        stroke={strokeColor}
                        strokeWidth="5"
                        strokeLinejoin="round"
                        filter={filter}
                      />
                    )}
                    <circle
                      cx="716"
                      cy="285"
                      r={isActive ? "28" : "20"}
                      fill={isActive ? strokeColor : "#FFFFFF"}
                      stroke={isActive ? "#FFFFFF" : "#CBD5E1"}
                      strokeWidth={isActive ? "3" : "2"}
                      className={isActive ? "animate-pulse" : ""}
                    />
                    <text
                      x="716"
                      y="292"
                      textAnchor="middle"
                      fill={isActive ? "#FFFFFF" : "#475569"}
                      fontSize={isActive ? "22" : "16"}
                      fontWeight="bold"
                      fontFamily="ui-monospace, monospace"
                    >
                      {isHoldShift ? '⇧' : ';'}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Right Hand Finger Chips */}
          <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-[#E1E7EF] text-[11px]">
            {rightFingers.map((f) => {
              const isTarget = activeFinger?.id === f.id;
              const isHoldShift = isShift && shiftHand === 'right' && f.id === 'right-pinky';
              return (
                <div
                  key={f.id + f.key}
                  className={`flex flex-col items-center px-1.5 py-0.5 rounded-md transition-colors ${
                    isTarget
                      ? 'bg-[#117C78] text-white font-bold shadow-xs ring-1 ring-[#117C78]'
                      : isHoldShift
                      ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                      : 'text-[#647184]'
                  }`}
                >
                  <span className="text-[9px] uppercase">{f.name}</span>
                  <span className="font-mono text-[10px] font-semibold">{f.key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
