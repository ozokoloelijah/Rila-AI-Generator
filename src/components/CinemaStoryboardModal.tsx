import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Camera,
  Maximize2,
  Disc,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VideoScene, VideoBlueprint } from '../types/blueprint';

interface CinemaStoryboardModalProps {
  blueprint: VideoBlueprint;
  initialSceneIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CinemaStoryboardModal: React.FC<CinemaStoryboardModalProps> = ({
  blueprint,
  initialSceneIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialSceneIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes = blueprint.scenes;
  const currentScene: VideoScene | undefined = scenes[currentIdx] || scenes[0];

  useEffect(() => {
    setCurrentIdx(initialSceneIndex);
  }, [initialSceneIndex]);

  // Scene auto-advance timer when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene or loop
          setCurrentIdx((c) => (c + 1) % scenes.length);
          return 0;
        }
        return prev + 2; // ~5 seconds per scene
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  // Clean audio on close
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!isOpen || !currentScene) return null;

  // Determine aspect ratio class
  const getAspectClass = () => {
    const ratio = blueprint.globalSettings.aspectRatio;
    if (ratio.includes('9:16')) return 'aspect-[9/16] max-h-[75vh] w-auto';
    if (ratio.includes('2.39')) return 'aspect-[2.39/1] w-full';
    if (ratio.includes('1:1')) return 'aspect-square max-h-[70vh] w-auto';
    return 'aspect-video w-full'; // 16:9 default
  };

  // Determine camera motion animation class
  const getCameraMotionClass = (motion: string) => {
    const m = motion.toLowerCase();
    if (m.includes('zoom') || m.includes('push in') || m.includes('dolly in')) {
      return 'scale-115 transition-transform duration-[6000ms] ease-out';
    }
    if (m.includes('pull out') || m.includes('zoom out')) {
      return 'scale-90 transition-transform duration-[6000ms] ease-out';
    }
    if (m.includes('pan left') || m.includes('tracking left')) {
      return '-translate-x-8 transition-transform duration-[6000ms] ease-out';
    }
    if (m.includes('pan right') || m.includes('tracking right')) {
      return 'translate-x-8 transition-transform duration-[6000ms] ease-out';
    }
    if (m.includes('crane') || m.includes('pedestal up') || m.includes('tilt up')) {
      return '-translate-y-6 scale-105 transition-transform duration-[6000ms] ease-out';
    }
    if (m.includes('drone') || m.includes('orbit')) {
      return 'scale-110 rotate-1 transition-transform duration-[6000ms] ease-out';
    }
    return 'scale-105 transition-transform duration-[6000ms] ease-out';
  };

  // Trigger TTS voiceover for scene
  const handlePlayVoiceover = async () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setAudioLoading(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Scene ${currentScene.sceneNumber}. ${currentScene.audioSfx}`,
          voiceName: 'Fenrir',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.audioBase64) throw new Error('Audio generation failed');

      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      audioRef.current = audio;
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (err) {
      console.error(err);
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0b0d14] border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#07080e]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Disc className="w-3.5 h-3.5 animate-spin" />
              CINEMA DIRECTOR SIMULATOR
            </span>
            <span className="text-sm font-semibold text-slate-200 hidden sm:inline">
              {blueprint.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Scene {currentIdx + 1} of {scenes.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Viewport Display */}
        <div className="flex-1 bg-black p-4 sm:p-6 flex items-center justify-center overflow-hidden relative">
          <div
            className={`relative rounded-xl overflow-hidden border border-slate-700/80 bg-gradient-to-br from-slate-900 via-[#101320] to-[#08090f] shadow-2xl flex items-center justify-center ${getAspectClass()}`}
          >
            {/* Dynamic visual background representing prompt visuals */}
            <div
              className={`absolute inset-0 bg-cover bg-center filter brightness-[0.75] contrast-[1.1] ${getCameraMotionClass(
                currentScene.cameraMotion
              )}`}
              style={{
                backgroundImage: `radial-gradient(ellipse at center, rgba(30, 41, 59, 0.4) 0%, rgba(10, 15, 30, 0.95) 100%)`,
              }}
            >
              {/* Abstract cinematic art lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/10 animate-pulse" />
            </div>

            {/* Cinema HUD Overlays */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none z-10">
              {/* Top HUD */}
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  <span className="text-rose-400">REC</span>
                  <span className="text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                    {blueprint.globalSettings.recommendedFrameRate}
                  </span>
                </div>
                <div className="text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  TC {currentScene.timeStamp}
                </div>
              </div>

              {/* Center Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-16 h-16 border border-slate-400/40 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-amber-400 rounded-full" />
                </div>
              </div>

              {/* Bottom HUD: Scene details */}
              <div className="space-y-2 pointer-events-auto">
                <div className="bg-black/75 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 max-w-2xl">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold mb-1">
                    <span>Scene {currentScene.sceneNumber} • {currentScene.timeStamp}</span>
                    <span className="text-rose-300 flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {currentScene.cameraMotion}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                    {currentScene.visualScenePrompt}
                  </p>
                  <p className="text-[11px] text-indigo-300 italic mt-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3 shrink-0" />
                    Audio: {currentScene.audioSfx}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber & Director Controls */}
        <div className="p-4 sm:p-5 bg-[#08090f] border-t border-slate-800 space-y-3">
          {/* Progress bar per scene */}
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Scene Selector tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setProgress(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentIdx === idx
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  S{s.sceneNumber} ({s.timeStamp.split('-')[0].trim()})
                </button>
              ))}
            </div>

            {/* Playback & Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayVoiceover}
                disabled={audioLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors cursor-pointer"
              >
                {audioLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : isPlayingAudio ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Voice Cue (TTS)'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentIdx((c) => (c > 0 ? c - 1 : scenes.length - 1));
                  setProgress(0);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Previous Scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Sequence'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentIdx((c) => (c + 1) % scenes.length);
                  setProgress(0);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Next Scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
