import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  Wand2,
  Film,
  Zap,
  ArrowRight,
  Maximize2,
  Clock,
  Gauge,
  Video,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { STYLE_PRESETS, TARGET_ENGINES, FORBIDDEN_WORDS, SAMPLE_PROMPTS } from '../constants/presets';
import { GenerationRequest } from '../types/blueprint';

interface PromptInputAreaProps {
  onGenerate: (params: GenerationRequest) => Promise<void>;
  isLoading: boolean;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cinematic 35mm Film');
  const [targetEngine, setTargetEngine] = useState('Runway Gen-3 Alpha');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('15s - 20s (Standard Scene Flow)');
  const [frameRate, setFrameRate] = useState('24 fps (Cinematic Film)');
  const [pacing, setPacing] = useState('Dynamic Camera & Balanced Movement');
  const [cameraPreference, setCameraPreference] = useState('35mm Anamorphic Lens, Shallow Depth of Field');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check for forbidden or anti-pattern words in prompt
  const detectedForbiddenWords = useMemo(() => {
    if (!topic.trim()) return [];
    const lower = topic.toLowerCase();
    return FORBIDDEN_WORDS.filter((item) => lower.includes(item.word.toLowerCase()));
  }, [topic]);

  const replaceForbiddenWord = (word: string, replacement: string) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    setTopic((prev) => prev.replace(regex, replacement));
  };

  const handleSelectSample = (sample: (typeof SAMPLE_PROMPTS)[0]) => {
    setTopic(sample.text);
    const matchedStyle = STYLE_PRESETS.find((s) => s.name === sample.style);
    if (matchedStyle) {
      setSelectedStyle(matchedStyle.name);
      setAspectRatio(sample.aspectRatio);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    onGenerate({
      topic: topic.trim(),
      stylePreset: selectedStyle,
      targetEngine,
      aspectRatio,
      duration,
      frameRate,
      pacing,
      cameraPreference,
    });
  };

  return (
    <div className="bg-[#0f121d] rounded-2xl border border-slate-800/90 shadow-2xl p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative top film strip accents */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top Badges / Engine selector bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              Target AI Model:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TARGET_ENGINES.map((engine) => (
                <button
                  type="button"
                  key={engine.id}
                  onClick={() => setTargetEngine(engine.name)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    targetEngine === engine.name
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {engine.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer ml-auto"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Director Settings</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Prompt Input Box */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              Video Concept, Script Prompt, or Scene Idea
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Concrete technical terminology yields highest video coherence
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A futuristic sports car drifting through neon-drenched Tokyo streets during heavy rain, steam rising from asphalt, cinematic tracking shot..."
              className="w-full bg-[#08090e] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* AI Video Prompt Anti-Pattern / Confusing Words Warning */}
        {detectedForbiddenWords.length > 0 && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Model Warning: Confusing terms detected for AI Video generators</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Words like "photorealistic" or "ultra-detailed" trigger texture blur or artifacts in Runway Gen-3, Sora, and Kling. Click to replace with concrete director instructions:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {detectedForbiddenWords.map((item) => (
                <button
                  type="button"
                  key={item.word}
                  onClick={() => replaceForbiddenWord(item.word, item.suggestion)}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={`Replace "${item.word}" with "${item.suggestion}"`}
                >
                  <span className="line-through opacity-70">"{item.word}"</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="font-semibold text-emerald-300">"{item.suggestion}"</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Style Presets Strip */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Visual Style Direction:</span>
            <span className="text-amber-400 text-[11px] font-mono">{selectedStyle}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = selectedStyle === preset.name;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => {
                    setSelectedStyle(preset.name);
                    setAspectRatio(preset.defaultAspect);
                    setFrameRate(preset.defaultFps);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/5'
                      : 'bg-[#0a0c13] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                      {preset.badge}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  </div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-1">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                    {preset.tags.slice(0, 2).join(' • ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Advanced Director Settings */}
        {showAdvanced && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-[#0a0c13] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="16:9">16:9 (Landscape Cinematic)</option>
                <option value="9:16">9:16 (Vertical TikTok / Reels / Shorts)</option>
                <option value="2.39:1">2.39:1 (Widescreen Anamorphic Cinema)</option>
                <option value="1:1">1:1 (Square Feed)</option>
                <option value="4:5">4:5 (Instagram Portrait)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Target Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#0a0c13] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="10s - 15s (Short High-Energy Hook)">10s - 15s (Short High-Energy Hook)</option>
                <option value="15s - 20s (Standard Scene Flow)">15s - 20s (Standard Scene Flow)</option>
                <option value="25s - 30s (Commercial / Narrative)">25s - 30s (Commercial / Narrative)</option>
                <option value="45s - 60s (Mini Cinematic Story)">45s - 60s (Mini Cinematic Story)</option>
              </select>
            </div>

            {/* Frame Rate */}
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                Frame Rate
              </label>
              <select
                value={frameRate}
                onChange={(e) => setFrameRate(e.target.value)}
                className="w-full bg-[#0a0c13] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="24 fps (Cinematic Film)">24 fps (Cinematic Motion Blur)</option>
                <option value="30 fps (Web & Commercial)">30 fps (Broadcast & Web)</option>
                <option value="60 fps (Hyper Fluid / Slow-mo)">60 fps (Hyper Fluid / Slow-mo)</option>
              </select>
            </div>

            {/* Camera / Lens Preference */}
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Camera & Lens Profile
              </label>
              <select
                value={cameraPreference}
                onChange={(e) => setCameraPreference(e.target.value)}
                className="w-full bg-[#0a0c13] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="35mm Anamorphic Lens, Shallow Depth of Field">35mm Anamorphic (Cinematic)</option>
                <option value="50mm Prime Lens, Natural Perspective">50mm Prime Lens (Human Eye)</option>
                <option value="16mm Wide Angle, Dynamic Immersion">16mm Ultra-Wide (Heroic Immersion)</option>
                <option value="100mm Macro Lens, Extreme Detail & Bokeh">100mm Macro (Intricate Product/Detail)</option>
                <option value="FPV Drone High Speed Acrobatic">FPV Drone (High Speed Dynamic)</option>
              </select>
            </div>
          </div>
        )}

        {/* Sample Templates & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Sample Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">Try Quick Ideas:</span>
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                type="button"
                key={sample.title}
                onClick={() => handleSelectSample(sample)}
                className="shrink-0 px-2.5 py-1 text-[11px] rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                {sample.title}
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              !topic.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Directing Scenes & Blueprint...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-slate-950" />
                <span>Generate Video Blueprint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
