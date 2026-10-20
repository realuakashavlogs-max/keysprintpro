/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getFingerForKey, getFingerInstruction, getShiftHand, requiresShift, FINGER_DATA } from '../data/fingerMapping';
import { FingerId } from '../types/typing';

interface HandGuideProps {
  activeChar: string;
}

export const HandGuide: React.FC<HandGuideProps> = ({ activeChar }) => {
  const activeFinger = activeChar ? getFingerForKey(activeChar) : null;
  const isShift = requiresShift(activeChar);
  const shiftHand = getShiftHand(activeChar);
  const info = getFingerInstruction(activeChar);

  // Finger definitions for Left and Right hands
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
    <div className="w-full rounded-2xl border border-[#E1E7EF] bg-white p-4 sm:p-5 shadow-xs">
      {/* Dynamic Instruction Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-[#E1E7EF]">
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

      {/* Two Hands Anatomical Vector Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Hand Card */}
        <div className="relative flex flex-col items-center rounded-xl bg-[#F8FAFC] border border-[#E1E7EF] p-4">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#647184]">
              Left Hand
            </span>
            {isShift && shiftHand === 'left' ? (
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                HOLD SHIFT
              </span>
            ) : (
              <span className="text-[11px] text-[#8692A6]">Anchor: A S D F</span>
            )}
          </div>

          {/* Left Hand SVG Diagram */}
          <div className="relative w-full max-w-[280px] h-[190px]">
            <svg
              viewBox="0 0 280 200"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Palm / Hand Base */}
              <path
                d="M45 195 C45 130 50 105 75 95 C100 88 175 88 195 105 C215 125 210 160 215 195 Z"
                fill="#EDF2F7"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              {/* Wrist lines */}
              <path d="M70 195 C100 190 160 190 190 195" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

              {/* Left Pinky (Finger 1) - Key A */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-pinky';
                const isHoldShift = isShift && shiftHand === 'left';
                const fill = isHoldShift ? '#FEF3C7' : isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isHoldShift ? '#F59E0B' : isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget || isHoldShift ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="35"
                      y="70"
                      width="26"
                      height="80"
                      rx="13"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    {/* Knuckle joint */}
                    <line x1="41" y1="105" x2="55" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="42" y1="125" x2="54" y2="125" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    {/* Key badge */}
                    <circle cx="48" cy="85" r="9" fill={isTarget ? '#315CE8' : isHoldShift ? '#F59E0B' : '#F1F5F9'} />
                    <text
                      x="48"
                      y="89"
                      textAnchor="middle"
                      fill={isTarget || isHoldShift ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {isHoldShift ? '⇧' : 'A'}
                    </text>
                  </g>
                );
              })()}

              {/* Left Ring (Finger 2) - Key S */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-ring';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="68"
                      y="35"
                      width="28"
                      height="110"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="75" y1="75" x2="89" y2="75" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="75" y1="105" x2="89" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <circle cx="82" cy="52" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="82"
                      y="56"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      S
                    </text>
                  </g>
                );
              })()}

              {/* Left Middle (Finger 3) - Key D */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-middle';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="103"
                      y="20"
                      width="28"
                      height="125"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="110" y1="65" x2="124" y2="65" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="110" y1="95" x2="124" y2="95" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <circle cx="117" cy="37" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="117"
                      y="41"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      D
                    </text>
                  </g>
                );
              })()}

              {/* Left Index (Finger 4) - Key F with tactile raised bump! */}
              {(() => {
                const isTarget = activeFinger?.id === 'left-index';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="138"
                      y="35"
                      width="28"
                      height="110"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="145" y1="75" x2="159" y2="75" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="145" y1="105" x2="159" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    {/* Key badge */}
                    <circle cx="152" cy="52" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="152"
                      y="56"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      F
                    </text>
                    {/* Tactile bump marker below key badge */}
                    <line x1="148" y1="64" x2="156" y2="64" stroke="#315CE8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                );
              })()}

              {/* Left Thumb (Finger 5) - Spacebar */}
              {(() => {
                const isTarget = activeFinger?.id === 'thumb';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <path
                      d="M178 120 C195 110 230 115 235 135 C238 150 215 165 195 160 Z"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <circle cx="212" cy="135" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="212"
                      y="139"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="9"
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

          {/* Left Hand Finger List Chips */}
          <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-[#E1E7EF] text-[11px]">
            {leftFingers.map((f) => {
              const isTarget = activeFinger?.id === f.id;
              const isHoldShift = isShift && shiftHand === 'left' && f.id === 'left-pinky';
              return (
                <div
                  key={f.id}
                  className={`flex flex-col items-center px-1.5 py-0.5 rounded-md transition-colors ${
                    isTarget
                      ? 'bg-[#315CE8] text-white font-bold shadow-xs'
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

        {/* Right Hand Card */}
        <div className="relative flex flex-col items-center rounded-xl bg-[#F8FAFC] border border-[#E1E7EF] p-4">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#647184]">
              Right Hand
            </span>
            {isShift && shiftHand === 'right' ? (
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                HOLD SHIFT
              </span>
            ) : (
              <span className="text-[11px] text-[#8692A6]">Anchor: J K L ;</span>
            )}
          </div>

          {/* Right Hand SVG Diagram */}
          <div className="relative w-full max-w-[280px] h-[190px]">
            <svg
              viewBox="0 0 280 200"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Palm / Hand Base */}
              <path
                d="M65 195 C70 160 65 125 85 105 C105 88 180 88 205 95 C230 105 235 130 235 195 Z"
                fill="#EDF2F7"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              <path d="M90 195 C120 190 180 190 210 195" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

              {/* Right Thumb (Finger 6) - Spacebar */}
              {(() => {
                const isTarget = activeFinger?.id === 'thumb';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <path
                      d="M102 120 C85 110 50 115 45 135 C42 150 65 165 85 160 Z"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <circle cx="68" cy="135" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="68"
                      y="139"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      ␣
                    </text>
                  </g>
                );
              })()}

              {/* Right Index (Finger 7) - Key J with tactile raised bump! */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-index';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="114"
                      y="35"
                      width="28"
                      height="110"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="121" y1="75" x2="135" y2="75" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="121" y1="105" x2="135" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    {/* Key badge */}
                    <circle cx="128" cy="52" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="128"
                      y="56"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      J
                    </text>
                    {/* Tactile bump marker below key badge */}
                    <line x1="124" y1="64" x2="132" y2="64" stroke="#315CE8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                );
              })()}

              {/* Right Middle (Finger 8) - Key K */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-middle';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="149"
                      y="20"
                      width="28"
                      height="125"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="156" y1="65" x2="170" y2="65" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="156" y1="95" x2="170" y2="95" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <circle cx="163" cy="37" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="163"
                      y="41"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      K
                    </text>
                  </g>
                );
              })()}

              {/* Right Ring (Finger 9) - Key L */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-ring';
                const fill = isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="184"
                      y="35"
                      width="28"
                      height="110"
                      rx="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="191" y1="75" x2="205" y2="75" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="191" y1="105" x2="205" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <circle cx="198" cy="52" r="9" fill={isTarget ? '#315CE8' : '#F1F5F9'} />
                    <text
                      x="198"
                      y="56"
                      textAnchor="middle"
                      fill={isTarget ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      L
                    </text>
                  </g>
                );
              })()}

              {/* Right Pinky (Finger 10) - Key ; */}
              {(() => {
                const isTarget = activeFinger?.id === 'right-pinky';
                const isHoldShift = isShift && shiftHand === 'right';
                const fill = isHoldShift ? '#FEF3C7' : isTarget ? '#EEF3FF' : '#FFFFFF';
                const stroke = isHoldShift ? '#F59E0B' : isTarget ? '#315CE8' : '#CBD5E1';
                const strokeW = isTarget || isHoldShift ? '2.5' : '1.5';
                return (
                  <g className="transition-all duration-150">
                    <rect
                      x="219"
                      y="70"
                      width="26"
                      height="80"
                      rx="13"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeW}
                    />
                    <line x1="225" y1="105" x2="239" y2="105" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <line x1="225" y1="125" x2="239" y2="125" stroke={stroke} strokeWidth="1" opacity="0.6" />
                    <circle cx="232" cy="85" r="9" fill={isTarget ? '#315CE8' : isHoldShift ? '#F59E0B' : '#F1F5F9'} />
                    <text
                      x="232"
                      y="89"
                      textAnchor="middle"
                      fill={isTarget || isHoldShift ? '#FFFFFF' : '#475569'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {isHoldShift ? '⇧' : ';'}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Right Hand Finger List Chips */}
          <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-[#E1E7EF] text-[11px]">
            {rightFingers.map((f) => {
              const isTarget = activeFinger?.id === f.id;
              const isHoldShift = isShift && shiftHand === 'right' && f.id === 'right-pinky';
              return (
                <div
                  key={f.id + f.key}
                  className={`flex flex-col items-center px-1.5 py-0.5 rounded-md transition-colors ${
                    isTarget
                      ? 'bg-[#315CE8] text-white font-bold shadow-xs'
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
