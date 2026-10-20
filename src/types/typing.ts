/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerInfo {
  id: FingerId;
  name: string;
  hand: 'left' | 'right' | 'thumbs';
  homeKey: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  targetText: string;
  isAssessment?: boolean;
  minAccuracy?: number;
  targetWpm?: number;
  timeLimitSeconds?: number;
}

export interface Level {
  id: number;
  stageId: number;
  title: string;
  objective: string;
  instructions: string;
  postureTip?: string;
  newKeys: string[];
  exercises: Exercise[];
  assessment: Exercise;
  minAccuracy: number;
  targetWpm: number;
  timeLimitSeconds?: number;
}

export interface Stage {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  levelStart: number;
  levelEnd: number;
  accentColor: string;
  badgeColor: string;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  unlocked: boolean;
  stars: number; // 0-3
  bestWpm: number;
  bestAccuracy: number;
  bestCpm: number;
  attempts: number;
  completedAt?: string;
}

export interface PracticeHistoryItem {
  id: string;
  timestamp: string;
  type: 'level' | 'speed_test' | 'free_practice';
  title: string;
  levelId?: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
  passed?: boolean;
}

export interface UserStats {
  totalKeystrokes: number;
  totalCorrectChars: number;
  totalErrors: number;
  totalPracticeTimeSeconds: number;
  highestWpm: number;
  averageAccuracy: number;
  streakDays: number;
  lastActiveDate: string;
  history: PracticeHistoryItem[];
}

export interface UserSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundType: 'mechanical' | 'soft' | 'beep';
  showVirtualKeyboard: boolean;
  showFingerGuide: boolean;
  showLiveWpm: boolean;
  highlightNextKey: boolean;
  blindMode: boolean; // hide text as typed
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'mono' | 'sans';
}

export interface TypingState {
  inputText: string;
  currentIndex: number;
  errorsCount: number;
  correctCount: number;
  startTime: number | null;
  endTime: number | null;
  isFinished: boolean;
  elapsedSeconds: number;
  currentWpm: number;
  currentAccuracy: number;
  currentCpm: number;
}
