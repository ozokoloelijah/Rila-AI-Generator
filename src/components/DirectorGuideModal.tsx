import React from 'react';
import { X, Film, CheckCircle2, XCircle, Sparkles, Video, Compass, Zap } from 'lucide-react';
import { FORBIDDEN_WORDS } from '../constants/presets';

interface DirectorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectorGuideModal: React.FC<DirectorGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0a0c13]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Rila Video Director Manual & Best Practices
              </h3>
              <p className="text-[11px] text-slate-400">
                How Rila optimizes prompts for Runway Gen-3, Sora, Luma & Kling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Rule 1: No Conversational Filler */}
          <div className="p-3.5 rounded-xl bg-[#07080e] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              1. Zero Conversational Filler
            </div>
            <p className="text-slate-400">
              Rila begins immediately with the structured sections. AI video generation pipelines require pure structured metadata without polite chat greetings.
            </p>
          </div>

          {/* Rule 2: Concrete Technical Cinematography Terms */}
          <div className="p-3.5 rounded-xl bg-[#07080e] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
              <Video className="w-3.5 h-3.5" />
              2. Avoid Model-Confusing Buzzwords
            </div>
            <p className="text-slate-400">
              AI video diffusion models have no concept of "photorealistic" or "ultra-detailed" — these words induce plastic textures, digital oversaturation, and blur. Instead, use exact physical lighting, optics, and texture terms:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {FORBIDDEN_WORDS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px]">
                    <XCircle className="w-3 h-3 shrink-0" />
                    <span className="line-through">{item.word}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{item.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule 3: Scene-by-Scene Camera Trajectories */}
          <div className="p-3.5 rounded-xl bg-[#07080e] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
              <Film className="w-3.5 h-3.5" />
              3. The 3 Core Blueprint Sections
            </div>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">[1]</span>
                <span><strong className="text-slate-200">Global Video Settings:</strong> Structural metadata (Aspect Ratio, Duration, Style, and Recommended Frame Rate).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">[2]</span>
                <span><strong className="text-slate-200">AI Video Prompt:</strong> Single master prompt with camera movement, lighting, lens profile, and texture dynamics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold">[3]</span>
                <span><strong className="text-slate-200">Scene-by-Scene Breakdown:</strong> 3 to 5 logical scenes with Time Stamp, Visual Scene Prompt, Camera Motion, and Audio/SFX cues.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0c13] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
          >
            Got it, Let's Direct
          </button>
        </div>
      </div>
    </div>
  );
};
