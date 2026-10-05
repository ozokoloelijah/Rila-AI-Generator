import React, { useState } from 'react';
import { Maximize2, Clock, Palette, Gauge, Check, Copy, Camera, Sparkles } from 'lucide-react';
import { GlobalVideoSettings } from '../types/blueprint';

interface GlobalSettingsCardProps {
  settings: GlobalVideoSettings;
  targetEngine?: string;
}

export const GlobalSettingsCard: React.FC<GlobalSettingsCardProps> = ({ settings, targetEngine }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySettings = () => {
    const text = `[Global Video Settings]
Aspect Ratio: ${settings.aspectRatio}
Estimated Duration: ${settings.estimatedDuration}
Style: ${settings.style}
Recommended Frame Rate: ${settings.recommendedFrameRate}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <span className="font-mono font-bold text-xs">01</span>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              [Global Video Settings]
            </h3>
            <p className="text-[11px] text-slate-400">Structural metadata & production specs</p>
          </div>
        </div>

        <button
          onClick={handleCopySettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          title="Copy Global Settings section"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Section</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Aspect Ratio */}
        <div className="bg-[#090b10] border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              Aspect Ratio
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Format
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono tracking-tight">
            {settings.aspectRatio}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Framing boundary for generator viewport
          </div>
        </div>

        {/* Estimated Duration */}
        <div className="bg-[#090b10] border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Estimated Duration
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Runtime
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono tracking-tight">
            {settings.estimatedDuration}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Composite target generation time
          </div>
        </div>

        {/* Style */}
        <div className="bg-[#090b10] border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              Style Direction
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Visuals
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100 line-clamp-2">
            {settings.style}
          </div>
          {settings.colorGrade && (
            <div className="text-[11px] text-indigo-300/80 mt-1 line-clamp-1">
              {settings.colorGrade}
            </div>
          )}
        </div>

        {/* Recommended Frame Rate */}
        <div className="bg-[#090b10] border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Recommended FPS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Motion
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono tracking-tight">
            {settings.recommendedFrameRate}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Natural motion cadence & temporal pacing
          </div>
        </div>
      </div>

      {/* Target Engine & Lens Specs if present */}
      {(targetEngine || settings.lensType) && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          {targetEngine && (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-500">Target Pipeline:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                {targetEngine}
              </span>
            </div>
          )}
          {settings.lensType && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-300 font-mono text-[11px]">{settings.lensType}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
