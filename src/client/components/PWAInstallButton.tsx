import React, { useState } from 'react';
import { usePWAInstall } from '@/src/client/hooks/usePWAInstall';
import { Download, Info } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-[#E1B95A] px-4 py-2 text-sm font-bold text-[#102321] shadow-sm hover:bg-[#C89B3C] transition-colors"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
        >
          <Download className="w-3.5 h-3.5" />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102321]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#063F3A]/20">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-[#0B6B5E]" />
                <h3 className="text-lg font-bold text-[#102321]">Install on iPhone / iPad</h3>
              </div>
              <p className="mt-2 text-sm text-[#657572] leading-relaxed">
                1. Tap the <strong>Share</strong> button in the Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-[#F8F5ED] py-2.5 text-sm font-bold text-[#063F3A] hover:bg-[#EFE9DB] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
