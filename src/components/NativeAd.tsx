/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const NativeAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center justify-center my-4 ${className}`}>
      <div className="w-full rounded-2xl overflow-hidden border border-[#E1E7EF] bg-transparent shadow-xs">
        <iframe
          title="Sponsored Recommendations"
          src="/ads/native-banner.html"
          className="w-full min-h-[140px] border-0"
          scrolling="no"
          style={{ border: 'none', width: '100%', height: '140px', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};
