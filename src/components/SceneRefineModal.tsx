import React, { useState } from 'react';
import { X, Wand2, Camera, Sparkles, Sliders, Check } from 'lucide-react';
import { VideoScene } from '../types/blueprint';

interface SceneRefineModalProps {
  scene: VideoScene | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRefinedScene: (refinedScene: VideoScene) => void;
  globalStyle?: string;
  targetEngine?: string;
}

export const SceneRefineModal: React.FC<SceneRefineModalProps> = ({
  scene,
  isOpen,
  onClose,
  onSaveRefinedScene,
  globalStyle,
  targetEngine,
}) => {
  const [instruction, setInstruction] = useState('');
  const [cameraOverride, setCameraOverride] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !scene) return null;

  const quickDirectPrompts = [
    'Change camera to a slow majestic crane shot rising above',
    'Add intense volumetric studio lighting and rim illumination',
    'Increase dynamic movement and whip pan transition',
    'Switch to a shallow depth of field 35mm macro close-up',
    'Add subtle rain drops and reflective neon puddle ripples',
  ];

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalInstruction = [
      instruction.trim(),
      cameraOverride ? `Camera instruction: ${cameraOverride}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    if (!finalInstruction) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch('/api/refine-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene,
          instruction: finalInstruction,
          globalStyle,
          targetEngine,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to refine scene');

      onSaveRefinedScene(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error refining scene');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0a0c13]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
              {scene.sceneNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Direct Scene {scene.sceneNumber} ({scene.timeStamp})
              </h3>
              <p className="text-[11px] text-slate-400">
                Refine prompt, adjust camera trajectory or enhance lighting
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
        <form onSubmit={handleRefine} className="p-5 space-y-4">
          {/* Current scene recap */}
          <div className="p-3 rounded-xl bg-[#07080e] border border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Current Visual Scene:
            </span>
            <p className="text-slate-300 line-clamp-2">{scene.visualScenePrompt}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-mono pt-1 border-t border-slate-800/80">
              <Camera className="w-3 h-3" />
              <span>{scene.cameraMotion}</span>
            </div>
          </div>

          {/* Quick Direct Chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Quick Director Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickDirectPrompts.map((q, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setInstruction(q)}
                  className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Instruction input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Director Refinement Instruction
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Speed up camera movement into an aggressive dolly push, add cyan volumetric fog, increase texture details on metallic surface..."
              className="w-full bg-[#08090e] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed"
            />
          </div>

          {/* Camera override selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              Camera Movement Override (Optional)
            </label>
            <select
              value={cameraOverride}
              onChange={(e) => setCameraOverride(e.target.value)}
              className="w-full bg-[#08090e] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Keep model recommended motion</option>
              <option value="cinematic crane shot rising smoothly">Cinematic Crane Shot (Rising)</option>
              <option value="slow dramatic zoom into subject with shallow DOF">Slow Dramatic Zoom In</option>
              <option value="slow zoom pulling out to reveal massive environment">Slow Zoom Out (Reveal)</option>
              <option value="lateral tracking pan left at consistent speed">Lateral Tracking Pan Left</option>
              <option value="lateral tracking pan right with cinematic motion blur">Lateral Tracking Pan Right</option>
              <option value="360 degree orbital camera sweep">360-Degree Orbital Sweep</option>
              <option value="FPV drone diving low through environment">FPV Drone Dive (High Speed)</option>
              <option value="static locked-off camera with intense internal motion">Static Locked-off Frame</option>
            </select>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!instruction.trim() && !cameraOverride)}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Directing Scene...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply Scene Direction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
