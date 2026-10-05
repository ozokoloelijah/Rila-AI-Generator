import React, { useState } from 'react';
import { Copy, Check, Sparkles, Terminal, Video, ExternalLink, Zap } from 'lucide-react';
import { TARGET_ENGINES } from '../constants/presets';

interface MasterPromptCardProps {
  masterPrompt: string;
  defaultEngine: string;
  directorNotes?: string;
}

export const MasterPromptCard: React.FC<MasterPromptCardProps> = ({
  masterPrompt,
  defaultEngine,
  directorNotes,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(defaultEngine || 'Runway Gen-3 Alpha');

  // Format prompt based on active engine
  const formattedPrompt = React.useMemo(() => {
    const engineConfig = TARGET_ENGINES.find((e) => e.name === selectedEngine);
    if (!engineConfig) return masterPrompt;
    return engineConfig.formatPrompt(masterPrompt, 'cinematic motion');
  }, [masterPrompt, selectedEngine]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySection = () => {
    const sectionText = `[AI Video Prompt]\n${masterPrompt}`;
    navigator.clipboard.writeText(sectionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <span className="font-mono font-bold text-xs">02</span>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              [AI Video Prompt]
            </h3>
            <p className="text-[11px] text-slate-400">
              Master prompt optimized for Runway Gen-3, Sora, Luma & Kling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySection}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Copy as [AI Video Prompt] section"
          >
            Copy Section
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for {selectedEngine.split(' ')[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Engine Switcher for tailored syntax */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 bg-[#0a0c13] p-1.5 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
          <Video className="w-3 h-3 text-amber-400" />
          Adapter:
        </span>
        {TARGET_ENGINES.map((engine) => (
          <button
            key={engine.id}
            onClick={() => setSelectedEngine(engine.name)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              selectedEngine === engine.name
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {engine.name}
          </button>
        ))}
      </div>

      {/* Prompt Body */}
      <div className="relative group">
        <div className="p-4 rounded-xl bg-[#07080d] border border-slate-800 font-sans text-sm text-slate-200 leading-relaxed tracking-normal select-all">
          {formattedPrompt}
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Enforced Technical Elements:
        </span>
        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] border border-indigo-500/20 font-mono">
          35mm / Anamorphic Optics
        </span>
        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20 font-mono">
          Volumetric Lighting
        </span>
        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[11px] border border-rose-500/20 font-mono">
          Camera Motion Path
        </span>
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/20 font-mono">
          Physical Texture Dynamics
        </span>
      </div>

      {/* Director Notes if available */}
      {directorNotes && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200/90 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Director Tip: </span>
            <span>{directorNotes}</span>
          </div>
        </div>
      )}
    </div>
  );
};
