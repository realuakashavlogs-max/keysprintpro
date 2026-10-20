/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  Keyboard,
  Type,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { UserSettings } from '../types/typing';
import { soundEngine } from '../utils/audio';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleToggleSound = (enabled: boolean) => {
    const updated = { ...settings, soundEnabled: enabled };
    onUpdateSettings(updated);
    soundEngine.configure(updated.soundEnabled, updated.soundVolume, updated.soundType);
    if (enabled) soundEngine.playKeyClick();
  };

  const handleVolumeChange = (vol: number) => {
    const updated = { ...settings, soundVolume: vol };
    onUpdateSettings(updated);
    soundEngine.configure(updated.soundEnabled, updated.soundVolume, updated.soundType);
    soundEngine.playKeyClick();
  };

  const handleSoundTypeChange = (type: 'mechanical' | 'soft' | 'beep') => {
    const updated = { ...settings, soundType: type };
    onUpdateSettings(updated);
    soundEngine.configure(updated.soundEnabled, updated.soundVolume, updated.soundType);
    soundEngine.playKeyClick();
  };

  const handleExecuteReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-bold text-[#315CE8] border border-[#315CE8]/20 mb-2">
          <SettingsIcon className="h-3.5 w-3.5" />
          <span>Application Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192230] tracking-tight">
          Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-[#647184] mt-1">
          Adjust sound effects, virtual keyboard, finger guides, and font preferences to suit your learning style.
        </p>
      </div>

      {resetSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[#16845B] text-sm">
          <Check className="h-5 w-5 shrink-0" />
          <span>All learning progress has been successfully reset to Level 1.</span>
        </div>
      )}

      {/* Audio Preferences */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#192230] mb-4 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-[#315CE8]" />
          <span>Audio & Sound Effects</span>
        </h2>

        <div className="flex flex-col gap-4 text-sm text-[#192230]">
          {/* Sound Enabled Switch */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#192230] block">Mechanical Key Click Sounds</span>
              <span className="text-xs text-[#647184]">Play procedural audio on keystrokes and errors</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSound(!settings.soundEnabled)}
              className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-[#315CE8]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          {settings.soundEnabled && (
            <div className="flex flex-col gap-1.5 pt-3 border-t border-[#E1E7EF]">
              <div className="flex justify-between text-xs font-semibold text-[#647184]">
                <span>Sound Volume</span>
                <span className="font-mono text-[#192230] tabular-nums">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#315CE8] cursor-pointer"
              />
            </div>
          )}

          {/* Switch Sound Type */}
          {settings.soundEnabled && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#E1E7EF]">
              <span className="text-xs font-bold text-[#647184]">Audio Character Profile</span>
              <div className="grid grid-cols-3 gap-2">
                {(['mechanical', 'soft', 'beep'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSoundTypeChange(type)}
                    className={`rounded-xl border p-2.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                      settings.soundType === type
                        ? 'border-[#315CE8] bg-[#EEF3FF] text-[#315CE8] shadow-xs'
                        : 'border-[#E1E7EF] bg-[#F8FAFC] text-[#647184] hover:text-[#192230]'
                    }`}
                  >
                    {type === 'mechanical' ? 'Mechanical Click' : type === 'soft' ? 'Soft Clack' : 'Digital Beep'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Displays Preferences */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#192230] mb-4 flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-[#117C78]" />
          <span>Visual Guidance & Layout</span>
        </h2>

        <div className="flex flex-col gap-4 text-sm text-[#192230]">
          {/* Virtual Keyboard Visibility */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#192230] block">Show Virtual Keyboard</span>
              <span className="text-xs text-[#647184]">Display QWERTY keyboard with real-time key highlights</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, showVirtualKeyboard: !settings.showVirtualKeyboard })
              }
              className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer ${
                settings.showVirtualKeyboard ? 'bg-[#315CE8]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.showVirtualKeyboard ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Finger Guide Visibility */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E1E7EF]">
            <div>
              <span className="font-semibold text-[#192230] block">Show Hand Guidance</span>
              <span className="text-xs text-[#647184]">Display left and right hand diagram highlighting active fingers</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, showFingerGuide: !settings.showFingerGuide })
              }
              className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer ${
                settings.showFingerGuide ? 'bg-[#315CE8]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.showFingerGuide ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Typography Preferences */}
      <div className="rounded-3xl border border-[#E1E7EF] bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#192230] mb-4 flex items-center gap-2">
          <Type className="h-4 w-4 text-[#315CE8]" />
          <span>Typing Text Display & Font</span>
        </h2>

        <div className="flex flex-col gap-4 text-sm text-[#192230]">
          <div>
            <span className="text-xs font-bold text-[#647184] block mb-2">Practice Font Size</span>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, fontSize: sz })}
                  className={`rounded-xl border p-2.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.fontSize === sz
                      ? 'border-[#315CE8] bg-[#EEF3FF] text-[#315CE8] shadow-xs'
                      : 'border-[#E1E7EF] bg-[#F8FAFC] text-[#647184] hover:text-[#192230]'
                  }`}
                >
                  {sz === 'sm' ? 'Small' : sz === 'md' ? 'Medium' : sz === 'lg' ? 'Large' : 'Extra Large'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E1E7EF]">
            <span className="text-xs font-bold text-[#647184] block mb-2">Font Family</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, fontFamily: 'mono' })}
                className={`rounded-xl border p-2.5 text-xs font-bold font-mono transition-all cursor-pointer ${
                  settings.fontFamily === 'mono'
                    ? 'border-[#315CE8] bg-[#EEF3FF] text-[#315CE8] shadow-xs'
                    : 'border-[#E1E7EF] bg-[#F8FAFC] text-[#647184] hover:text-[#192230]'
                }`}
              >
                Monospace (Code & Precision)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, fontFamily: 'sans' })}
                className={`rounded-xl border p-2.5 text-xs font-bold font-sans transition-all cursor-pointer ${
                  settings.fontFamily === 'sans'
                    ? 'border-[#315CE8] bg-[#EEF3FF] text-[#315CE8] shadow-xs'
                    : 'border-[#E1E7EF] bg-[#F8FAFC] text-[#647184] hover:text-[#192230]'
                }`}
              >
                Sans-Serif (Modern Clean)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#D64550] mb-1 flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          <span>Danger Zone: Reset All Progress</span>
        </h2>
        <p className="text-xs text-[#647184] mb-4 leading-relaxed">
          Resetting will clear all completed levels, stars, high scores, and practice records. Level 1 will be unlocked and Levels 2–100 will be locked. This cannot be undone.
        </p>

        {!showConfirmReset ? (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-[#D64550] hover:bg-rose-50 transition-colors cursor-pointer shadow-xs"
          >
            Reset All 100 Levels Progress...
          </button>
        ) : (
          <div className="rounded-2xl border border-rose-300 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#D64550] text-xs font-bold mb-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Are you completely sure you want to reset all your progress?</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleExecuteReset}
                className="rounded-xl bg-[#D64550] px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="rounded-xl border border-[#E1E7EF] bg-white px-4 py-2 text-xs font-semibold text-[#647184] hover:text-[#192230] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
