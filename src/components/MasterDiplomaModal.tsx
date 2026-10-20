/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, X, Printer, ShieldCheck } from 'lucide-react';
import { UserStats } from '../types/typing';

interface MasterDiplomaModalProps {
  isOpen: boolean;
  stats: UserStats;
  completedLevelsCount: number;
  onClose: () => void;
}

export const MasterDiplomaModal: React.FC<MasterDiplomaModalProps> = ({
  isOpen,
  stats,
  completedLevelsCount,
  onClose,
}) => {
  const [studentName, setStudentName] = useState<string>('Touch Typing Scholar');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#192230]/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E1E7EF] text-[#647184] hover:text-[#192230] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Certificate Border Frame */}
        <div className="relative rounded-2xl border-4 border-double border-[#315CE8]/40 bg-[#FAFBFD] p-6 sm:p-10 text-center shadow-inner">
          <div className="flex flex-col items-center">
            {/* Seal / Emblem */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3FF] border border-[#315CE8]/30 text-[#315CE8] shadow-xs mb-3">
              <Award className="h-9 w-9 text-[#315CE8]" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#315CE8]">
              KEYSPRINT TOUCH TYPING ACADEMY
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#192230] tracking-tight mt-1">
              Certificate of Touch Typing Mastery
            </h2>
            <p className="text-xs sm:text-sm text-[#647184] mt-2 italic font-serif">
              This prestigious credential is formally presented to
            </p>

            {/* Recipient Name */}
            <div className="my-4 border-b-2 border-[#315CE8]/30 pb-1 px-6">
              {isEditing ? (
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className="bg-transparent text-center font-serif text-2xl sm:text-3xl font-bold text-[#192230] focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#192230] hover:text-[#315CE8] transition-colors cursor-pointer"
                  title="Click to edit recipient name"
                >
                  {studentName} <span className="text-xs text-[#8692A6] font-sans font-normal ml-1">✎</span>
                </button>
              )}
            </div>

            {/* Declaration Text */}
            <p className="max-w-xl text-xs sm:text-sm text-[#475569] leading-relaxed font-serif">
              in recognition of successfully mastering touch typing fundamentals, home row anchors,
              multi-row transitions, number row precision, and high-velocity sentence endurance across{' '}
              <strong className="text-[#192230] font-mono">{completedLevelsCount} Curriculum Levels</strong>{' '}
              with a personal best of{' '}
              <strong className="text-[#315CE8] font-mono">{stats.highestWpm} Words Per Minute</strong>{' '}
              and an overall accuracy rating of{' '}
              <strong className="text-[#16845B] font-mono">{stats.averageAccuracy}%</strong>.
            </p>

            {/* Bottom Signatures & Seal */}
            <div className="mt-8 pt-6 border-t border-[#E1E7EF] w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-left">
                <span className="text-[10px] text-[#8692A6] uppercase block font-semibold">
                  Date Awarded
                </span>
                <span className="font-serif font-bold text-[#192230]">{today}</span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[#16845B]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  VERIFIED TOUCH TYPIST
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8692A6] uppercase block font-semibold">
                  Certification Board
                </span>
                <span className="font-serif font-bold text-[#192230]">KeySprint Academy Board</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-white border border-[#E1E7EF] px-4 py-2.5 text-xs font-bold text-[#192230] hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="h-4 w-4 text-[#647184]" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#315CE8] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2546B8] transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
