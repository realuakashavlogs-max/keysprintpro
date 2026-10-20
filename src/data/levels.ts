/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level } from '../types/typing';
import { STAGE_1_LEVELS } from './levels/stage1';
import { STAGE_2_LEVELS } from './levels/stage2';
import { STAGE_3_LEVELS } from './levels/stage3';
import { STAGE_4_LEVELS } from './levels/stage4';
import { STAGE_5_LEVELS } from './levels/stage5';
import { STAGE_6_LEVELS } from './levels/stage6';
import { STAGE_7_LEVELS } from './levels/stage7';
import { STAGE_8_LEVELS } from './levels/stage8';
import { STAGE_9_LEVELS } from './levels/stage9';
import { STAGE_10_LEVELS } from './levels/stage10';

export const ALL_LEVELS: Level[] = [
  ...STAGE_1_LEVELS,
  ...STAGE_2_LEVELS,
  ...STAGE_3_LEVELS,
  ...STAGE_4_LEVELS,
  ...STAGE_5_LEVELS,
  ...STAGE_6_LEVELS,
  ...STAGE_7_LEVELS,
  ...STAGE_8_LEVELS,
  ...STAGE_9_LEVELS,
  ...STAGE_10_LEVELS,
];

export function getLevelById(id: number): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}

export function getLevelsByStage(stageId: number): Level[] {
  return ALL_LEVELS.filter((l) => l.stageId === stageId);
}

export function getNextLevel(currentId: number): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === currentId + 1);
}

export function getPreviousLevel(currentId: number): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === currentId - 1);
}
