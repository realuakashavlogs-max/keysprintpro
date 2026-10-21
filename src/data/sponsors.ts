/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SPONSOR_URLS = {
  /**
   * Homepage sponsor (Link 1): Compact, professional banner near top of homepage
   */
  homepage: 'https://asiafilm.org/4/8f898fe854ee3f572c3a972f7c881cb0',

  /**
   * Completed challenge sponsor (Link 2): Dedicated 5-second interstitial after completing a challenge
   */
  completedChallenge: 'https://asiafilm.org/4/4974ba802b0f63cd05cc1a70220eca28',

  /**
   * Typing test result sponsor (Link 3): Card below genuine WPM/accuracy results
   */
  speedTestResult: 'https://auctionr.org/4/e5dc89ec7d4b59193991292d189c25f0',
} as const;

export const openSponsorLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
