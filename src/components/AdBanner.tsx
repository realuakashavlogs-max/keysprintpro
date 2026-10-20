/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

export type AdBannerType =
  | '728x90'
  | '468x60'
  | '300x250'
  | '160x600'
  | '160x300'
  | '320x50';

interface AdConfig {
  key: string;
  width: number;
  height: number;
  path: string;
}

export const AD_CONFIGS: Record<AdBannerType, AdConfig> = {
  '728x90': {
    key: '8d99b8373640c99a158a0bbcebf6d90b',
    width: 728,
    height: 90,
    path: '/ads/banner-728x90.html',
  },
  '468x60': {
    key: '255308d9b8ca1bc39204fc340c8e73a6',
    width: 468,
    height: 60,
    path: '/ads/banner-468x60.html',
  },
  '300x250': {
    key: '950b360a86bec83028f4a65b3ab921a4',
    width: 300,
    height: 250,
    path: '/ads/banner-300x250.html',
  },
  '160x600': {
    key: 'c0dd84ba849f61edbb9b93fd5a0316dc',
    width: 160,
    height: 600,
    path: '/ads/banner-160x600.html',
  },
  '160x300': {
    key: 'd9f866161cbdb155e6186f68b88e9755',
    width: 160,
    height: 300,
    path: '/ads/banner-160x300.html',
  },
  '320x50': {
    key: 'bf830789fc0427f2d5100d9e9b9ee044',
    width: 320,
    height: 50,
    path: '/ads/banner-320x50.html',
  },
};

interface AdBannerProps {
  type: AdBannerType;
  className?: string;
  showLabel?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  className = '',
  showLabel = true,
}) => {
  const config = AD_CONFIGS[type];
  if (!config) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center my-2 ${className}`}
      data-ad-type={type}
    >
      {showLabel && (
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8692A6] mb-1">
          Advertisement
        </span>
      )}
      <div
        className="overflow-hidden rounded-xl border border-[#E1E7EF] bg-transparent shadow-xs flex items-center justify-center"
        style={{ width: `${config.width}px`, height: `${config.height}px` }}
      >
        <iframe
          title={`Ad ${type}`}
          src={config.path}
          width={config.width}
          height={config.height}
          scrolling="no"
          style={{
            border: 'none',
            overflow: 'hidden',
            width: `${config.width}px`,
            height: `${config.height}px`,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Responsive Leaderboard Banner:
 * Dynamically mounts ONLY the single ad unit appropriate for screen width:
 * - >= 768px: 728x90 Leaderboard
 * - 640px - 767px: 468x60 Banner
 * - < 640px: 320x50 Mobile Banner
 */
export const ResponsiveAdLeaderboard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setScreenSize('desktop');
      } else if (width >= 640) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <div className={`w-full flex justify-center py-2 ${className}`}>
      {screenSize === 'desktop' && <AdBanner type="728x90" />}
      {screenSize === 'tablet' && <AdBanner type="468x60" />}
      {screenSize === 'mobile' && <AdBanner type="320x50" />}
    </div>
  );
};

export const SMARTLINK_URL = 'https://araplhn.org/4/cfb6b5e707675cd314e11f6de0e74672';
