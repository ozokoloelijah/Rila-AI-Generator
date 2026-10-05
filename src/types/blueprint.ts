export interface GlobalVideoSettings {
  aspectRatio: string;
  estimatedDuration: string;
  style: string;
  recommendedFrameRate: string;
  targetEngine?: string;
  colorGrade?: string;
  lensType?: string;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  timeStamp: string;
  visualScenePrompt: string;
  cameraMotion: string;
  audioSfx: string;
  durationSeconds?: number;
  cameraMovementType?: 'crane' | 'zoom' | 'pan' | 'orbit' | 'dolly' | 'drone' | 'static' | 'tilt';
}

export interface VideoBlueprint {
  id: string;
  title: string;
  rawUserInput: string;
  createdAt: string;
  formattedOutput: string;
  globalSettings: GlobalVideoSettings;
  masterPrompt: string;
  scenes: VideoScene[];
  targetEngine: string;
  directorNotes?: string;
}

export interface GenerationRequest {
  topic: string;
  stylePreset?: string;
  targetEngine?: string;
  aspectRatio?: string;
  duration?: string;
  frameRate?: string;
  pacing?: string;
  cameraPreference?: string;
}
