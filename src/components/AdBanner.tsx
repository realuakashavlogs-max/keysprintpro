/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

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
  scriptUrl: string;
}

export const AD_CONFIGS: Record<AdBannerType, AdConfig> = {
  '728x90': {
    key: '8d99b8373640c99a158a0bbcebf6d90b',
    width: 728,
    height: 90,
    scriptUrl: 'https://bauval.org/22/8d99b8373640c99a158a0bbcebf6d90b',
  },
  '468x60': {
    key: '255308d9b8ca1bc39204fc340c8e73a6',
    width: 468,
    height: 60,
    scriptUrl: 'https://bauval.org/22/255308d9b8ca1bc39204fc340c8e73a6',
  },
  '300x250': {
    key: '950b360a86bec83028f4a65b3ab921a4',
    width: 300,
    height: 250,
    scriptUrl: 'https://bauval.org/22/950b360a86bec83028f4a65b3ab921a4',
  },
  '160x600': {
    key: 'c0dd84ba849f61edbb9b93fd5a0316dc',
    width: 160,
    height: 600,
    scriptUrl: 'https://bauval.org/22/c0dd84ba849f61edbb9b93fd5a0316dc',
  },
  '160x300': {
    key: 'd9f866161cbdb155e6186f68b88e9755',
    width: 160,
    height: 300,
    scriptUrl: 'https://bauval.org/22/d9f866161cbdb155e6186f68b88e9755',
  },
  '320x50': {
    key: 'bf830789fc0427f2d5100d9e9b9ee044',
    width: 320,
    height: 50,
    scriptUrl: 'https://bauval.org/22/bf830789fc0427f2d5100d9e9b9ee044',
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
  const uniqueId = useId();

  if (!config) return null;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${config.key}',
      'format' : 'iframe',
      'height' : ${config.height},
      'width' : ${config.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="${config.scriptUrl}"></script>
</body>
</html>`;

  return (
    <div
      className={`flex flex-col items-center justify-center my-3 ${className}`}
      data-ad-type={type}
    >
      {showLabel && (
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8692A6] mb-1">
          Advertisement
        </span>
      )}
      <div
        className="overflow-hidden rounded-xl bg-white border border-[#E1E7EF] shadow-xs flex items-center justify-center transition-opacity hover:opacity-95"
        style={{ width: `${config.width}px`, height: `${config.height}px` }}
      >
        <iframe
          key={`${type}-${uniqueId}`}
          title={`Ad ${type}`}
          srcDoc={htmlContent}
          width={config.width}
          height={config.height}
          style={{
            border: 'none',
            overflow: 'hidden',
            width: `${config.width}px`,
            height: `${config.height}px`,
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

/**
 * Responsive Leaderboard Banner:
 * - >= 768px: 728x90 Leaderboard
 * - 640px - 767px: 468x60 Banner
 * - < 640px: 320x50 Mobile Banner
 */
export const ResponsiveAdLeaderboard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`w-full flex justify-center py-2 ${className}`}>
      {/* Desktop (728x90) */}
      <div className="hidden md:block">
        <AdBanner type="728x90" />
      </div>
      {/* Tablet (468x60) */}
      <div className="hidden sm:block md:hidden">
        <AdBanner type="468x60" />
      </div>
      {/* Mobile (320x50) */}
      <div className="block sm:hidden">
        <AdBanner type="320x50" />
      </div>
    </div>
  );
};

export const SMARTLINK_URL = 'https://araplhn.org/4/cfb6b5e707675cd314e11f6de0e74672';
