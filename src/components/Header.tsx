import React from 'react';
import { Clapperboard, Video, Sparkles, FolderOpen, Play, Info } from 'lucide-react';

interface HeaderProps {
  onOpenSaved: () => void;
  savedCount: number;
  onOpenQuickGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSaved,
  savedCount,
  onOpenQuickGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#090a0f] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                RILA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 font-mono text-sm tracking-widest lowercase">generator</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Director AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Text-to-Video AI Generator & Production Director Blueprint Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenQuickGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            title="Director Guide & Best Practices"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Director Rules</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-gradient-to-r from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-800 border border-slate-700/70 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Blueprints</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
