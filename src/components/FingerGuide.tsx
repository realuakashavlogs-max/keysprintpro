/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FINGER_DATA, getFingerForKey, getShiftHand, requiresShift } from '../data/fingerMapping';
import { FingerId } from '../types/typing';

interface FingerGuideProps {
  activeChar: string;
}

export const FingerGuide: React.FC<FingerGuideProps> = ({ activeChar }) => {
  const activeFinger = activeChar ? getFingerForKey(activeChar) : null;
  const isShift = requiresShift(activeChar);
  const shiftHand = getShiftHand(activeChar);

  const leftFingers: { id: FingerId; label: string; home: string }[] = [
    { id: 'left-pinky', label: 'Pinky', home: 'A' },
    { id: 'left-ring', label: 'Ring', home: 'S' },
    { id: 'left-middle', label: 'Middle', home: 'D' },
    { id: 'left-index', label: 'Index', home: 'F' },
    { id: 'thumb', label: 'Thumb', home: 'Space' },
  ];

  const rightFingers: { id: FingerId; label: string; home: string }[] = [
    { id: 'thumb', label: 'Thumb', home: 'Space' },
    { id: 'right-index', label: 'Index', home: 'J' },
    { id: 'right-middle', label: 'Middle', home: 'K' },
    { id: 'right-ring', label: 'Ring', home: 'L' },
    { id: 'right-pinky', label: 'Pinky', home: ';' },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
          FINGER PLACEMENT & HAND GUIDANCE
        </span>
        {activeFinger && (
          <span className="text-slate-400">
            Target Key:{' '}
            <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              {activeChar === ' ' ? 'Space' : activeChar}
            </strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Left Hand */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">LEFT HAND</span>
            {isShift && shiftHand === 'left' && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40 animate-pulse">
                HOLD SHIFT (PINKY)
              </span>
            )}
          </div>
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 pt-1 pb-1">
            {leftFingers.map((f, i) => {
              const data = FINGER_DATA[f.id];
              const isTargetFinger =
                activeFinger?.id === f.id ||
                (isShift && shiftHand === 'left' && f.id === 'left-pinky');

              // Visual finger heights (pinky shorter, middle tallest)
              const heights = ['h-12', 'h-16', 'h-20', 'h-16', 'h-10'];
              const heightClass = heights[i] || 'h-14';

              return (
                <div
                  key={f.id + i}
                  className={`flex flex-col items-center justify-between rounded-t-xl rounded-b-md px-1 sm:px-2 py-1 transition-all ${heightClass} w-11 sm:w-14 border ${
                    isTargetFinger
                      ? 'ring-2 ring-blue-400 scale-105 z-10 shadow-lg'
                      : 'border-slate-800 bg-slate-900/80 opacity-70'
                  }`}
                  style={{
                    backgroundColor: isTargetFinger ? `${data.colorHex}25` : undefined,
                    borderColor: isTargetFinger ? data.colorHex : undefined,
                  }}
                >
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isTargetFinger ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {f.label}
                  </span>
                  <div className="flex flex-col items-center">
                    <span
                      className="h-2 w-2 rounded-full mb-0.5"
                      style={{ backgroundColor: data.colorHex }}
                    />
                    <span className="text-[10px] font-mono text-slate-300 font-semibold">
                      {f.home}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">RIGHT HAND</span>
            {isShift && shiftHand === 'right' && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40 animate-pulse">
                HOLD SHIFT (PINKY)
              </span>
            )}
          </div>
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 pt-1 pb-1">
            {rightFingers.map((f, i) => {
              const data = FINGER_DATA[f.id];
              const isTargetFinger =
                activeFinger?.id === f.id ||
                (isShift && shiftHand === 'right' && f.id === 'right-pinky');

              // Visual finger heights (thumb shortest, middle tallest)
              const heights = ['h-10', 'h-16', 'h-20', 'h-16', 'h-12'];
              const heightClass = heights[i] || 'h-14';

              return (
                <div
                  key={f.id + i}
                  className={`flex flex-col items-center justify-between rounded-t-xl rounded-b-md px-1 sm:px-2 py-1 transition-all ${heightClass} w-11 sm:w-14 border ${
                    isTargetFinger
                      ? 'ring-2 ring-indigo-400 scale-105 z-10 shadow-lg'
                      : 'border-slate-800 bg-slate-900/80 opacity-70'
                  }`}
                  style={{
                    backgroundColor: isTargetFinger ? `${data.colorHex}25` : undefined,
                    borderColor: isTargetFinger ? data.colorHex : undefined,
                  }}
                >
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isTargetFinger ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {f.label}
                  </span>
                  <div className="flex flex-col items-center">
                    <span
                      className="h-2 w-2 rounded-full mb-0.5"
                      style={{ backgroundColor: data.colorHex }}
                    />
                    <span className="text-[10px] font-mono text-slate-300 font-semibold">
                      {f.home}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
