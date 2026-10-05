import React, { useState } from 'react';
import {
  Film,
  Camera,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Edit3,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Disc,
} from 'lucide-react';
import { VideoScene } from '../types/blueprint';

interface SceneBreakdownCardProps {
  scenes: VideoScene[];
  onOpenRefine: (scene: VideoScene) => void;
  onPreviewAll: () => void;
  onSelectSceneForPreview: (sceneIndex: number) => void;
}

export const SceneBreakdownCard: React.FC<SceneBreakdownCardProps> = ({
  scenes,
  onOpenRefine,
  onPreviewAll,
  onSelectSceneForPreview,
}) => {
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleCopyScene = (scene: VideoScene) => {
    const text = `Scene ${scene.sceneNumber} (${scene.timeStamp})
Visual Scene Prompt: ${scene.visualScenePrompt}
Camera Motion: ${scene.cameraMotion}
Audio/SFX: ${scene.audioSfx}`;
    navigator.clipboard.writeText(text);
    setCopiedSceneId(scene.id);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  const handleCopyVisualPromptOnly = (scene: VideoScene) => {
    navigator.clipboard.writeText(scene.visualScenePrompt);
    setCopiedSceneId(`prompt-${scene.id}`);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  const handleCopyAllScenesSection = () => {
    const text = `[Scene-by-Scene Breakdown]\n` +
      scenes
        .map(
          (s) =>
            `Scene ${s.sceneNumber} [${s.timeStamp}]\n- Visual Scene Prompt: ${s.visualScenePrompt}\n- Camera Motion: ${s.cameraMotion}\n- Audio/SFX: ${s.audioSfx}`
        )
        .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  // Play voiceover/SFX cue preview via server-side TTS
  const handlePlayAudioCue = async (scene: VideoScene) => {
    if (playingAudioId === scene.id) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingAudioId(null);
      return;
    }

    try {
      setLoadingAudioId(scene.id);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Scene ${scene.sceneNumber}. ${scene.audioSfx}`,
          voiceName: 'Fenrir',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || 'TTS error');
      }

      if (audioElement) {
        audioElement.pause();
      }

      const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
      setAudioElement(audio);
      setPlayingAudioId(scene.id);

      audio.onended = () => {
        setPlayingAudioId(null);
      };

      await audio.play();
    } catch (err) {
      console.error('Audio cue preview failed:', err);
    } finally {
      setLoadingAudioId(null);
    }
  };

  return (
    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="font-mono font-bold text-xs">03</span>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              [Scene-by-Scene Breakdown]
            </h3>
            <p className="text-[11px] text-slate-400">
              {scenes.length} Production scenes with Camera Motion & Audio cues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPreviewAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Cinema Storyboard</span>
          </button>

          <button
            onClick={handleCopyAllScenesSection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          >
            {copiedSection ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy All Scenes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Timeline Strip */}
      <div className="bg-[#090b10] border border-slate-800/80 rounded-xl p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span className="font-mono font-semibold uppercase tracking-wider text-slate-500">
            Timeline Flow
          </span>
          <span className="text-slate-500 font-mono">
            {scenes[0]?.timeStamp.split('-')[0]?.trim()} → {scenes[scenes.length - 1]?.timeStamp.split('-')[1]?.trim() || 'END'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {scenes.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => onSelectSceneForPreview(idx)}
              className="p-2 rounded-lg bg-[#0e111a] hover:bg-slate-800/60 border border-slate-800/80 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="font-bold text-amber-400">SCENE {sc.sceneNumber}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{sc.timeStamp}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium line-clamp-1 group-hover:text-amber-200">
                {sc.visualScenePrompt}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-indigo-400/90 mt-1 line-clamp-1">
                <Camera className="w-2.5 h-2.5 shrink-0" />
                <span>{sc.cameraMotion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scene Cards List */}
      <div className="space-y-3.5">
        {scenes.map((scene, idx) => {
          const isCopied = copiedSceneId === scene.id;
          const isPromptCopied = copiedSceneId === `prompt-${scene.id}`;
          const isAudioPlaying = playingAudioId === scene.id;
          const isAudioLoading = loadingAudioId === scene.id;

          return (
            <div
              key={scene.id}
              className="bg-[#090b10] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-md group relative overflow-hidden"
            >
              {/* Scene Number & Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                    {scene.sceneNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Scene {scene.sceneNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {scene.timeStamp}
                    </span>
                  </div>
                </div>

                {/* Actions per scene */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectSceneForPreview(idx)}
                    className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Simulate Camera & Storyboard"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenRefine(scene)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
                    title="Refine scene prompt or camera motion"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Direct</span>
                  </button>
                  <button
                    onClick={() => handleCopyVisualPromptOnly(scene)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
                    title="Copy Visual Prompt for generation"
                  >
                    {isPromptCopied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>Copy Prompt</span>
                  </button>
                </div>
              </div>

              {/* Three Core Required Sub-fields */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                {/* 1. Visual Scene Prompt (8 cols) */}
                <div className="lg:col-span-7 bg-[#050609] border border-slate-850 rounded-xl p-3.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <Film className="w-3 h-3 text-amber-400" />
                      Visual Scene Prompt
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans select-all">
                      {scene.visualScenePrompt}
                    </p>
                  </div>
                </div>

                {/* 2. Camera Motion & 3. Audio/SFX (5 cols) */}
                <div className="lg:col-span-5 space-y-2.5 flex flex-col justify-between">
                  {/* Camera Motion */}
                  <div className="bg-[#050609] border border-slate-850 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                      <Camera className="w-3 h-3 text-rose-400" />
                      Camera Motion
                    </span>
                    <p className="text-xs font-semibold text-rose-300/90 font-mono">
                      {scene.cameraMotion}
                    </p>
                  </div>

                  {/* Audio / SFX */}
                  <div className="bg-[#050609] border border-slate-850 rounded-xl p-3 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                        <Volume2 className="w-3 h-3 text-indigo-400" />
                        Audio / SFX & Voiceover
                      </span>
                      <p className="text-xs text-slate-300/90 italic">
                        "{scene.audioSfx}"
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayAudioCue(scene)}
                      disabled={isAudioLoading}
                      className={`shrink-0 p-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isAudioPlaying
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                      }`}
                      title="Listen to Director Voice Cue"
                    >
                      {isAudioLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      ) : isAudioPlaying ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
