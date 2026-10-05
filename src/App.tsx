import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInputArea } from './components/PromptInputArea';
import { GlobalSettingsCard } from './components/GlobalSettingsCard';
import { MasterPromptCard } from './components/MasterPromptCard';
import { SceneBreakdownCard } from './components/SceneBreakdownCard';
import { RawBlueprintView } from './components/RawBlueprintView';
import { CinemaStoryboardModal } from './components/CinemaStoryboardModal';
import { SceneRefineModal } from './components/SceneRefineModal';
import { SavedProjectsDrawer } from './components/SavedProjectsDrawer';
import { DirectorGuideModal } from './components/DirectorGuideModal';
import { VideoBlueprint, VideoScene, GenerationRequest } from './types/blueprint';
import {
  Sparkles,
  Clapperboard,
  LayoutGrid,
  FileText,
  Play,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Video,
  Layers,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'rila_video_generator_saved_blueprints_v1';

// Initial preloaded cinematic blueprint to showcase capabilities immediately
const INITIAL_DEMO_BLUEPRINT: VideoBlueprint = {
  id: 'demo-blueprint-tokyo-drift',
  title: 'Tokyo Cyber-Drift: Neon Horizon',
  rawUserInput:
    'A midnight sports car drifting through neon-lit streets in Shinjuku during heavy rain, neon reflections on wet asphalt, steam rising from grates.',
  createdAt: new Date().toISOString(),
  targetEngine: 'Runway Gen-3 Alpha',
  globalSettings: {
    aspectRatio: '16:9',
    estimatedDuration: '16s',
    style: 'Neo-Noir Cyberpunk shot on Anamorphic 35mm',
    recommendedFrameRate: '24 fps cinematic motion',
    colorGrade: 'Teal and amber tint, deep blacks, high dynamic range highlights',
    lensType: '35mm Panavision anamorphic prime lens, shallow depth of field',
  },
  masterPrompt:
    'Shot on 35mm anamorphic prime lens. A matte obsidian high-performance sports car executing a controlled drift around a wet Shinjuku corner. Heavy rain streaks across reflective metallic bodywork. Wet asphalt mirrors vibrant neon magenta and cyan billboard lights. Volumetric steam plumes ascend from sewer grates. Low-angle tracking camera follows parallel to the spinning alloy wheels. 24 fps cinematic motion blur, natural lens flare streaks, atmospheric mist.',
  scenes: [
    {
      id: 'scene-1',
      sceneNumber: 1,
      timeStamp: '0:00 - 0:04',
      visualScenePrompt:
        'Low-angle ground level shot of wet asphalt illuminated by neon cyan signage. Water droplets bounce off puddles before high-grip racing tires enter frame kicking up a fine volumetric water spray mist.',
      cameraMotion: 'Static ground-level camera with dynamic whip pan tracking the entering vehicle',
      audioSfx: 'Distant low-frequency bass hum of city ambient synth, sudden tire squeal cutting through rain patter',
      cameraMovementType: 'pan',
    },
    {
      id: 'scene-2',
      sceneNumber: 2,
      timeStamp: '0:04 - 0:08',
      visualScenePrompt:
        'Close-up profile of the matte black sports car drifting sideways through the intersection. Holographic advertisements cast flickering amber light across the tinted glass and carbon fiber hood.',
      cameraMotion: 'Smooth lateral dolly tracking shot matching vehicle velocity parallel to chassis',
      audioSfx: 'High-revving twin-turbo engine roar with distinctive turbo flutter and exhaust crackle',
      cameraMovementType: 'dolly',
    },
    {
      id: 'scene-3',
      sceneNumber: 3,
      timeStamp: '0:08 - 0:12',
      visualScenePrompt:
        'Medium shot looking from the rear quarter as the car counter-steers. Volumetric steam plumes erupt from road grates, backlit by blood-orange taillights piercing the atmospheric drizzle.',
      cameraMotion: 'Slow cinematic crane shot rising from tire level to high three-quarter angle',
      audioSfx: 'Deep resonant exhaust pulse reverberating between skyscraper alleyways, rain crescendo',
      cameraMovementType: 'crane',
    },
    {
      id: 'scene-4',
      sceneNumber: 4,
      timeStamp: '0:12 - 0:16',
      visualScenePrompt:
        'Wide establishing shot down the neon-drenched avenue as the sports car accelerates into the rainy distance, twin red light trails dissolving into the Tokyo haze.',
      cameraMotion: 'Slow dramatic zoom out pulling back to reveal towering illuminated architectural canyon',
      audioSfx: 'Engine sound fading into atmospheric synthwave chords and sustained rain ambience',
      cameraMovementType: 'zoom',
    },
  ],
  formattedOutput: `1. [Global Video Settings]:
- Aspect Ratio: 16:9
- Estimated Duration: 16s
- Style: Neo-Noir Cyberpunk shot on Anamorphic 35mm
- Recommended Frame Rate: 24 fps cinematic motion

2. [AI Video Prompt]:
Shot on 35mm anamorphic prime lens. A matte obsidian high-performance sports car executing a controlled drift around a wet Shinjuku corner. Heavy rain streaks across reflective metallic bodywork. Wet asphalt mirrors vibrant neon magenta and cyan billboard lights. Volumetric steam plumes ascend from sewer grates. Low-angle tracking camera follows parallel to the spinning alloy wheels. 24 fps cinematic motion blur, natural lens flare streaks, atmospheric mist.

3. [Scene-by-Scene Breakdown]:
Scene 1:
- Time Stamp: 0:00 - 0:04
- Visual Scene Prompt: Low-angle ground level shot of wet asphalt illuminated by neon cyan signage. Water droplets bounce off puddles before high-grip racing tires enter frame kicking up a fine volumetric water spray mist.
- Camera Motion: Static ground-level camera with dynamic whip pan tracking the entering vehicle
- Audio/SFX: Distant low-frequency bass hum of city ambient synth, sudden tire squeal cutting through rain patter

Scene 2:
- Time Stamp: 0:04 - 0:08
- Visual Scene Prompt: Close-up profile of the matte black sports car drifting sideways through the intersection. Holographic advertisements cast flickering amber light across the tinted glass and carbon fiber hood.
- Camera Motion: Smooth lateral dolly tracking shot matching vehicle velocity parallel to chassis
- Audio/SFX: High-revving twin-turbo engine roar with distinctive turbo flutter and exhaust crackle

Scene 3:
- Time Stamp: 0:08 - 0:12
- Visual Scene Prompt: Medium shot looking from the rear quarter as the car counter-steers. Volumetric steam plumes erupt from road grates, backlit by blood-orange taillights piercing the atmospheric drizzle.
- Camera Motion: Slow cinematic crane shot rising from tire level to high three-quarter angle
- Audio/SFX: Deep resonant exhaust pulse reverberating between skyscraper alleyways, rain crescendo

Scene 4:
- Time Stamp: 0:12 - 0:16
- Visual Scene Prompt: Wide establishing shot down the neon-drenched avenue as the sports car accelerates into the rainy distance, twin red light trails dissolving into the Tokyo haze.
- Camera Motion: Slow dramatic zoom out pulling back to reveal towering illuminated architectural canyon
- Audio/SFX: Engine sound fading into atmospheric synthwave chords and sustained rain ambience`,
  directorNotes:
    'For Runway Gen-3 and Kling, keep motion strength around 6-7 to preserve structural wheel geometry while sustaining volumetric rain streaks.',
};

export default function App() {
  const [activeBlueprint, setActiveBlueprint] = useState<VideoBlueprint>(INITIAL_DEMO_BLUEPRINT);
  const [savedBlueprints, setSavedBlueprints] = useState<VideoBlueprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tabs: 'director' (rich storyboard cards) vs 'verbatim' (pure raw text)
  const [activeTab, setActiveTab] = useState<'director' | 'verbatim'>('director');

  // Modals state
  const [isStoryboardOpen, setIsStoryboardOpen] = useState(false);
  const [previewSceneIndex, setPreviewSceneIndex] = useState(0);
  const [sceneToRefine, setSceneToRefine] = useState<VideoScene | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Load saved blueprints from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedBlueprints(parsed);
        } else {
          setSavedBlueprints([INITIAL_DEMO_BLUEPRINT]);
        }
      } else {
        setSavedBlueprints([INITIAL_DEMO_BLUEPRINT]);
      }
    } catch (e) {
      console.error('Error loading saved blueprints', e);
    }
  }, []);

  // Save blueprint helper
  const saveToStorage = (newBp: VideoBlueprint) => {
    setSavedBlueprints((prev) => {
      const filtered = prev.filter((p) => p.id !== newBp.id);
      const updated = [newBp, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleDeleteBlueprint = (id: string) => {
    setSavedBlueprints((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Main generation handler
  const handleGenerate = async (params: GenerationRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blueprint');
      }

      setActiveBlueprint(data);
      saveToStorage(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during blueprint generation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update a scene after refinement
  const handleSaveRefinedScene = (refined: VideoScene) => {
    setActiveBlueprint((prev) => {
      const updatedScenes = prev.scenes.map((s) => (s.id === refined.id ? refined : s));
      const updatedBp: VideoBlueprint = {
        ...prev,
        scenes: updatedScenes,
      };
      saveToStorage(updatedBp);
      return updatedBp;
    });
  };

  const handleOpenPreviewForScene = (index: number) => {
    setPreviewSceneIndex(index);
    setIsStoryboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans film-grain">
      {/* Top Studio Header */}
      <Header
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={savedBlueprints.length}
        onOpenQuickGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Director Prompt Input Suite */}
        <PromptInputArea onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Output View Section Header & Tab Switcher */}
        {activeBlueprint && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-[1px]">
                  <div className="w-full h-full bg-[#0a0c13] rounded-[11px] flex items-center justify-center">
                    <Clapperboard className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{activeBlueprint.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {activeBlueprint.targetEngine}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Production-ready AI Video Blueprint • {activeBlueprint.scenes.length} Scenes
                  </p>
                </div>
              </div>

              {/* View Switcher: Interactive Cards vs Verbatim Output */}
              <div className="flex items-center gap-1.5 bg-[#0e111a] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('director')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'director'
                      ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Interactive Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('verbatim')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'verbatim'
                      ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Verbatim Data Output</span>
                </button>

                <button
                  onClick={() => {
                    setPreviewSceneIndex(0);
                    setIsStoryboardOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all shadow-sm cursor-pointer ml-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Cinema Preview</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Interactive Director Studio */}
            {activeTab === 'director' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* 1. [Global Video Settings] */}
                <GlobalSettingsCard
                  settings={activeBlueprint.globalSettings}
                  targetEngine={activeBlueprint.targetEngine}
                />

                {/* 2. [AI Video Prompt] */}
                <MasterPromptCard
                  masterPrompt={activeBlueprint.masterPrompt}
                  defaultEngine={activeBlueprint.targetEngine}
                  directorNotes={activeBlueprint.directorNotes}
                />

                {/* 3. [Scene-by-Scene Breakdown] */}
                <SceneBreakdownCard
                  scenes={activeBlueprint.scenes}
                  onOpenRefine={(scene) => setSceneToRefine(scene)}
                  onPreviewAll={() => {
                    setPreviewSceneIndex(0);
                    setIsStoryboardOpen(true);
                  }}
                  onSelectSceneForPreview={handleOpenPreviewForScene}
                />
              </div>
            )}

            {/* TAB 2: Verbatim Raw Data Output */}
            {activeTab === 'verbatim' && (
              <div className="animate-in fade-in duration-150">
                <RawBlueprintView blueprint={activeBlueprint} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06070a] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Rila Video Generator</span>
            <span>•</span>
            <span>Backend Director Studio for Runway Gen-3, Sora, Luma & Kling</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Optimized for Cinematic Coherence & Technical Camera Optics
          </div>
        </div>
      </footer>

      {/* Cinema Storyboard Simulator Modal */}
      {isStoryboardOpen && activeBlueprint && (
        <CinemaStoryboardModal
          blueprint={activeBlueprint}
          initialSceneIndex={previewSceneIndex}
          isOpen={isStoryboardOpen}
          onClose={() => setIsStoryboardOpen(false)}
        />
      )}

      {/* Scene Refine Modal */}
      {sceneToRefine && (
        <SceneRefineModal
          scene={sceneToRefine}
          isOpen={!!sceneToRefine}
          onClose={() => setSceneToRefine(null)}
          onSaveRefinedScene={handleSaveRefinedScene}
          globalStyle={activeBlueprint.globalSettings.style}
          targetEngine={activeBlueprint.targetEngine}
        />
      )}

      {/* Saved Blueprints Drawer */}
      <SavedProjectsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedBlueprints={savedBlueprints}
        onSelectBlueprint={(bp) => setActiveBlueprint(bp)}
        onDeleteBlueprint={handleDeleteBlueprint}
      />

      {/* Director Guide Modal */}
      <DirectorGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
