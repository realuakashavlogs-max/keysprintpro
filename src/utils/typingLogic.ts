/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Standard WPM formula:
 * 1 standard word = 5 characters (including spaces and punctuation).
 * WPM = (correctCharacters / 5) / (elapsedSeconds / 60)
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  // Prevent absurd spikes in the first second
  const safeSeconds = Math.max(elapsedSeconds, 1);
  const minutes = safeSeconds / 60;
  const words = correctChars / 5;
  const wpm = Math.round(words / minutes);
  return Math.max(0, Math.min(wpm, 350));
}

/**
 * CPM: Characters per minute = (correctChars / elapsedSeconds) * 60
 */
export function calculateCpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  const safeSeconds = Math.max(elapsedSeconds, 1);
  const minutes = safeSeconds / 60;
  return Math.round(correctChars / minutes);
}

/**
 * Accuracy percentage = (correctChars / totalKeystrokes) * 100
 */
export function calculateAccuracy(correctChars: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  if (correctChars <= 0) return 0;
  const raw = (correctChars / totalKeystrokes) * 100;
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

/**
 * Star rating based on accuracy and WPM targets
 * 3 stars: met or exceeded both accuracy target and WPM target + 5
 * 2 stars: passed assessment (met minAccuracy and basic speed)
 * 1 star: met accuracy or close
 * 0 stars: failed criteria
 */
export function calculateStars(
  accuracy: number,
  wpm: number,
  minAccuracy: number,
  targetWpm: number
): number {
  if (accuracy < minAccuracy) {
    return 0;
  }
  if (accuracy >= Math.min(100, minAccuracy + 4) && wpm >= targetWpm + 5) {
    return 3;
  }
  if (accuracy >= minAccuracy && wpm >= targetWpm) {
    return 2;
  }
  return 1;
}

export function assessLevelPassed(
  accuracy: number,
  wpm: number,
  minAccuracy: number,
  targetWpm: number
): { passed: boolean; message: string; stars: number } {
  const stars = calculateStars(accuracy, wpm, minAccuracy, targetWpm);
  const passed = accuracy >= minAccuracy && (targetWpm === 0 || wpm >= Math.max(5, targetWpm - 5));

  if (!passed) {
    if (accuracy < minAccuracy) {
      return {
        passed: false,
        stars: 0,
        message: `Accuracy was ${accuracy}%, but this level requires at least ${minAccuracy}%. Focus on hitting the right keys before speeding up!`,
      };
    }
    return {
      passed: false,
      stars: 0,
      message: `Speed was ${wpm} WPM, but target was ${targetWpm} WPM. Try keeping a steady rhythm without stopping!`,
    };
  }

  return {
    passed: true,
    stars: Math.max(1, stars),
    message: stars === 3 
      ? 'Flawless performance! Outstanding speed and accuracy!' 
      : stars === 2 
      ? 'Great job! You passed the criteria with flying colors.' 
      : 'Level completed! Keep practicing to boost your speed and stars.',
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
