/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export const NativeAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script is already present
    const existingScript = containerRef.current.querySelector('script[src*="f4329ea7a3f5ec39a9bf69973ac0c374"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://bauval.org/21/f4329ea7a3f5ec39a9bf69973ac0c374';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8692A6] mb-1">
        Sponsored Recommendations
      </span>
      <div
        ref={containerRef}
        className="w-full max-w-3xl min-h-[90px] rounded-2xl border border-[#E1E7EF] bg-white p-3 shadow-xs flex flex-col items-center justify-center"
      >
        <div id="container-f4329ea7a3f5ec39a9bf69973ac0c374" className="w-full text-center"></div>
      </div>
    </div>
  );
};
