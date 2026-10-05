import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to call Gemini with retries across candidate models
async function generateWithFallback(prompt: string, systemInstruction: string, schema: any) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        console.warn(`Attempt ${attempt + 1} with model ${model} failed:`, errMsg);
        // Wait briefly before retry
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('All models failed to respond.');
}

// Fallback high-fidelity blueprint generator if API suffers upstream outages
function synthesizeFallbackBlueprint(params: {
  topic: string;
  stylePreset?: string;
  targetEngine?: string;
  aspectRatio?: string;
  duration?: string;
  frameRate?: string;
  cameraPreference?: string;
}) {
  const cleanTopic = params.topic.trim();
  const aspect = params.aspectRatio || '16:9';
  const dur = params.duration ? params.duration.split(' ')[0] : '16s';
  const fps = params.frameRate ? params.frameRate.split(' ')[0] : '24 fps';
  const style = params.stylePreset || 'Cinematic Film on Anamorphic 35mm';
  const engine = params.targetEngine || 'Runway Gen-3 Alpha';

  const masterPrompt = `Shot on 35mm anamorphic prime lens. ${cleanTopic}. Volumetric atmospheric lighting with subtle rim illumination, high dynamic range with rich color gradation. Authentic physical surface textures, natural motion blur. Dynamic camera movement with steady stabilization. 24 fps cinematic cadence.`;

  const scenes = [
    {
      sceneNumber: 1,
      timeStamp: '0:00 - 0:04',
      visualScenePrompt: `Establishing shot of ${cleanTopic}. Environmental elements establish the atmosphere with soft volumetric light cutting through subtle atmospheric haze.`,
      cameraMotion: 'Slow cinematic crane shot moving forward while tilting smoothly downwards',
      audioSfx: 'Subtle ambient atmospheric room tone, gentle rising low-frequency swell',
      cameraMovementType: 'crane',
    },
    {
      sceneNumber: 2,
      timeStamp: '0:04 - 0:08',
      visualScenePrompt: `Close-up framing focusing on primary subject details in ${cleanTopic}. Natural depth of field isolates focal point with sharp optics and soft background bokeh.`,
      cameraMotion: 'Smooth lateral dolly tracking left matching the natural trajectory of subject motion',
      audioSfx: 'Focal action sound effects, crisp tactile audio cues, resonant midrange harmonic',
      cameraMovementType: 'dolly',
    },
    {
      sceneNumber: 3,
      timeStamp: '0:08 - 0:12',
      visualScenePrompt: `Dynamic visual crescendo where action intensifies in ${cleanTopic}. High-contrast lighting accents highlights with cinematic lens flare streaks.`,
      cameraMotion: 'Slow dramatic zoom in combined with a slight orbital arc to accentuate dimension',
      audioSfx: 'Rhythmic percussive beat build-up, heightened dynamic frequency response',
      cameraMovementType: 'zoom',
    },
    {
      sceneNumber: 4,
      timeStamp: '0:12 - 0:16',
      visualScenePrompt: `Wide resolving shot showing complete scope and aftermath of ${cleanTopic}. Subject settles as lighting shifts towards warm golden hour glow.`,
      cameraMotion: 'Slow pull-out zoom expanding into heroic wide-angle perspective',
      audioSfx: 'Sustained cinematic orchestral resolution chord, gradual audio fade-out',
      cameraMovementType: 'zoom',
    },
  ];

  const formattedOutput = `1. [Global Video Settings]:
- Aspect Ratio: ${aspect}
- Estimated Duration: ${dur}
- Style: ${style}
- Recommended Frame Rate: ${fps}

2. [AI Video Prompt]:
${masterPrompt}

3. [Scene-by-Scene Breakdown]:
${scenes
  .map(
    (s) => `Scene ${s.sceneNumber}:
- Time Stamp: ${s.timeStamp}
- Visual Scene Prompt: ${s.visualScenePrompt}
- Camera Motion: ${s.cameraMotion}
- Audio/SFX: ${s.audioSfx}`
  )
  .join('\n\n')}`;

  return {
    title: cleanTopic.slice(0, 35),
    globalSettings: {
      aspectRatio: aspect,
      estimatedDuration: dur,
      style,
      recommendedFrameRate: fps,
      colorGrade: 'Teal and amber balanced grade, high dynamic range',
      lensType: '35mm anamorphic prime lens',
    },
    masterPrompt,
    scenes,
    formattedOutput,
    directorNotes: `Optimized for ${engine}. Maintain prompt consistency across keyframes.`,
  };
}
app.post('/api/generate', async (req, res) => {
  try {
    const {
      topic,
      stylePreset,
      targetEngine = 'Runway Gen-3 Alpha',
      aspectRatio,
      duration,
      frameRate,
      pacing,
      cameraPreference,
    } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a topic or prompt for the video blueprint.' });
    }

    const systemInstruction = `You are a highly capable Text-to-Video AI Generator and Director app backend called Rila video generator. Your job is to take a simple user description and transform it into a structured, production-ready AI video generation blueprint.

When the user gives you a topic, idea, or script prompt, you must output a structured response with the following sections:

1. [Global Video Settings]: Define the structural metadata (Aspect Ratio, Estimated Duration, Style, and Recommended Frame Rate).
2. [AI Video Prompt]: A single, highly detailed master prompt optimized for tools like Runway Gen-3, Luma Dream Machine, Sora, or Kling AI. Include specific camera instructions, lighting, texture, and movement.
3. [Scene-by-Scene Breakdown]: Divide the video into 3 to 5 logical scenes. For EACH scene, provide:
   - Time Stamp (e.g., 0:00 - 0:04)
   - Visual Scene Prompt: What is explicitly happening on screen.
   - Camera Motion: Exact camera movements (e.g., cinematic crane shot, slow zoom, panning left).
   - Audio/SFX: Suggested background audio or voiceover cues.

CRITICAL INSTRUCTIONS:
- Do not include conversational filler (e.g., "Sure, here is your video layout"). Start directly with the data.
- Ensure the prompt avoids words that confuse AI video models (like "photorealistic" or "ultra-detailed"). Instead, use concrete technical terms like "shot on 35mm lens", "volumetric studio lighting", or "8k resolution digital art".
- Tailor the visual style precisely to the user's intent (e.g., if they ask for a social media ad, use vibrant, fast-paced, scroll-stopping aesthetics).`;

    const userPromptContent = `Create a production-ready video blueprint for:
Topic / Concept: "${topic.trim()}"
${stylePreset ? `Preferred Visual Style: ${stylePreset}` : ''}
${targetEngine ? `Target AI Video Model: ${targetEngine}` : ''}
${aspectRatio ? `Preferred Aspect Ratio: ${aspectRatio}` : ''}
${duration ? `Estimated Duration: ${duration}` : ''}
${frameRate ? `Recommended Frame Rate: ${frameRate}` : ''}
${pacing ? `Pacing & Motion: ${pacing}` : ''}
${cameraPreference ? `Camera / Lens Style: ${cameraPreference}` : ''}

Generate the complete blueprint now following the exact required sections.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        formattedOutput: {
          type: Type.STRING,
          description: 'The complete verbatim text output containing [Global Video Settings], [AI Video Prompt], and [Scene-by-Scene Breakdown] with no conversational filler at all.',
        },
        title: {
          type: Type.STRING,
          description: 'Short catchy cinematic title for this video project (3-6 words)',
        },
        globalSettings: {
          type: Type.OBJECT,
          properties: {
            aspectRatio: { type: Type.STRING, description: 'e.g. 16:9, 9:16, 2.39:1' },
            estimatedDuration: { type: Type.STRING, description: 'e.g. 15s, 30s' },
            style: { type: Type.STRING, description: 'e.g. Neo-Noir Cyberpunk shot on Anamorphic 35mm' },
            recommendedFrameRate: { type: Type.STRING, description: 'e.g. 24 fps cinematic or 60 fps' },
            colorGrade: { type: Type.STRING, description: 'e.g. Teal & Amber tint, high dynamic range' },
            lensType: { type: Type.STRING, description: 'e.g. 35mm anamorphic prime lens, shallow depth of field' },
          },
          required: ['aspectRatio', 'estimatedDuration', 'style', 'recommendedFrameRate'],
        },
        masterPrompt: {
          type: Type.STRING,
          description: 'The single master AI Video Prompt optimized for Runway/Sora/Luma/Kling with camera instructions, lighting, texture, and movement.',
        },
        scenes: {
          type: Type.ARRAY,
          description: '3 to 5 logical scenes',
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              timeStamp: { type: Type.STRING, description: 'e.g. 0:00 - 0:04' },
              visualScenePrompt: { type: Type.STRING, description: 'Detailed prompt of what is happening on screen' },
              cameraMotion: { type: Type.STRING, description: 'Exact camera movements e.g. cinematic crane shot, slow zoom, panning left' },
              audioSfx: { type: Type.STRING, description: 'Suggested background audio or voiceover cues' },
              cameraMovementType: { 
                type: Type.STRING, 
                description: 'One of: crane, zoom, pan, orbit, dolly, drone, static, tilt' 
              },
            },
            required: ['sceneNumber', 'timeStamp', 'visualScenePrompt', 'cameraMotion', 'audioSfx'],
          },
        },
        directorNotes: {
          type: Type.STRING,
          description: 'Executive director advice for rendering in Runway Gen-3, Sora, Kling or Luma (e.g. motion intensity slider settings, seed consistency tips)',
        },
      },
      required: ['formattedOutput', 'title', 'globalSettings', 'masterPrompt', 'scenes'],
    };

    let parsedData: any = null;
    try {
      parsedData = await generateWithFallback(userPromptContent, systemInstruction, schema);
    } catch (apiErr) {
      console.warn('Gemini models unavailable, utilizing resilient director synthesis:', apiErr);
      parsedData = synthesizeFallbackBlueprint({
        topic,
        stylePreset,
        targetEngine,
        aspectRatio,
        duration,
        frameRate,
        cameraPreference,
      });
    }

    // Ensure scenes have unique IDs
    const scenesWithIds = (parsedData.scenes || []).map((sc: any, idx: number) => ({
      ...sc,
      id: `scene-${Date.now()}-${idx + 1}`,
      sceneNumber: sc.sceneNumber || idx + 1,
    }));

    const result = {
      id: `blueprint-${Date.now()}`,
      title: parsedData.title || topic.slice(0, 30),
      rawUserInput: topic,
      createdAt: new Date().toISOString(),
      formattedOutput: parsedData.formattedOutput,
      globalSettings: parsedData.globalSettings,
      masterPrompt: parsedData.masterPrompt,
      scenes: scenesWithIds,
      targetEngine,
      directorNotes: parsedData.directorNotes || '',
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating video blueprint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate video blueprint. Please verify your prompt.',
    });
  }
});

// Endpoint: Refine Scene
app.post('/api/refine-scene', async (req, res) => {
  try {
    const { scene, instruction, globalStyle, targetEngine } = req.body;
    if (!scene || !instruction) {
      return res.status(400).json({ error: 'Missing scene or instruction' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are Rila video generator director backend. Refine the following scene based on director's feedback:
Target Engine: ${targetEngine || 'Runway Gen-3'}
Global Style: ${globalStyle || 'Cinematic'}

Existing Scene:
- Time Stamp: ${scene.timeStamp}
- Visual Prompt: ${scene.visualScenePrompt}
- Camera Motion: ${scene.cameraMotion}
- Audio/SFX: ${scene.audioSfx}

Director's Refinement Request: "${instruction}"

Output ONLY a JSON object with the refined scene properties:
- timeStamp
- visualScenePrompt (strictly avoid words like "photorealistic", use concrete technical camera/lighting/texture terms)
- cameraMotion
- audioSfx
- cameraMovementType (crane, zoom, pan, orbit, dolly, drone, static, tilt)`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            timeStamp: { type: Type.STRING },
            visualScenePrompt: { type: Type.STRING },
            cameraMotion: { type: Type.STRING },
            audioSfx: { type: Type.STRING },
            cameraMovementType: { type: Type.STRING },
          },
          required: ['timeStamp', 'visualScenePrompt', 'cameraMotion', 'audioSfx'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Failed to refine scene');
    const refined = JSON.parse(text);
    return res.json({
      ...scene,
      ...refined,
    });
  } catch (err: any) {
    console.error('Error refining scene:', err);
    return res.status(500).json({ error: err.message || 'Scene refinement failed' });
  }
});

// Endpoint: Director Voiceover / Audio Cue Preview using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Fenrir' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Clean text to avoid markdown brackets
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/https?:\/\/\S+/g, '').slice(0, 300);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Cinematic narrator, dynamic film director commentary',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: ['Fenrir', 'Puck', 'Charon', 'Kore', 'Zephyr'].includes(voiceName)
                ? voiceName
                : 'Fenrir',
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated' });
    }

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rila Video Generator backend listening on port ${PORT}`);
  });
}

startServer();
