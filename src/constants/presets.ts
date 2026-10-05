export interface StylePreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  iconName: string;
  defaultAspect: string;
  defaultFps: string;
  tags: string[];
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'cinematic-35mm',
    name: 'Cinematic 35mm Film',
    description: 'Arri Alexa 65, Panavision anamorphic lenses, natural golden hour rim light, organic 35mm grain.',
    badge: 'Hollywood 35mm',
    iconName: 'Film',
    defaultAspect: '2.39:1',
    defaultFps: '24 fps',
    tags: ['Anamorphic', 'Kodak 5219', 'Shallow DOF', '24fps'],
  },
  {
    id: 'cyberpunk-scifi',
    name: 'Cyberpunk & Sci-Fi',
    description: 'Neon volumetric haze, rain-slicked asphalt, holographic lens flares, high contrast synthwave palette.',
    badge: 'Neo-Tokyo',
    iconName: 'Zap',
    defaultAspect: '16:9',
    defaultFps: '24 fps',
    tags: ['Volumetric Smoke', 'Neon Cyan & Magenta', 'Rain Drops', 'Drone FPV'],
  },
  {
    id: 'commercial-ugc',
    name: 'TikTok / Social UGC Viral',
    description: 'Fast kinetic cuts, punchy vibrant lighting, vertical framing, high scroll-stopping visual hooks.',
    badge: 'Viral Hook',
    iconName: 'Smartphone',
    defaultAspect: '9:16',
    defaultFps: '30 fps',
    tags: ['9:16 Vertical', 'Fast Whip Pan', 'Vibrant Colors', 'Punch In'],
  },
  {
    id: 'luxury-commercial',
    name: 'Luxury Brand Commercial',
    description: 'Slow motion 120fps, macro liquid refractions, sleek obsidian backdrop, controlled studio softbox light.',
    badge: 'High Fashion',
    iconName: 'Sparkles',
    defaultAspect: '16:9',
    defaultFps: '24 fps',
    tags: ['Macro 100mm', 'Prism Refraction', 'Obsidian Surface', 'Slow Motion'],
  },
  {
    id: 'anime-ghibli',
    name: 'Anime / Ghibli Aesthetic',
    description: 'Hand-painted watercolor backgrounds, fluffy cumulus clouds, gentle wind animation, golden hour warmth.',
    badge: 'Artisan Anime',
    iconName: 'Palette',
    defaultAspect: '16:9',
    defaultFps: '24 fps',
    tags: ['Watercolor Texture', 'Cel Shaded', 'Gentle Wind', 'Atmospheric Haze'],
  },
  {
    id: 'macro-nature',
    name: 'National Geographic Macro',
    description: 'Extreme macro probe lens, dewdrops, insect wings, crisp bokeh, volumetric sun rays through canopy.',
    badge: 'NatGeo 8K',
    iconName: 'Leaf',
    defaultAspect: '16:9',
    defaultFps: '60 fps',
    tags: ['Probe Lens', 'Volumetric Sunbeams', 'Subsurface Scattering', '60fps'],
  },
];

export const TARGET_ENGINES = [
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    company: 'RunwayML',
    badge: 'Camera Motion King',
    description: 'Excels at continuous camera paths, motion brush, and prompt adherence.',
    formatPrompt: (prompt: string, camera: string) => `${prompt} --camera ${camera.toLowerCase().replace(/[^a-z0-9 ]/g, '')}`,
  },
  {
    id: 'openai-sora',
    name: 'OpenAI Sora',
    company: 'OpenAI',
    badge: 'Physics & Realism',
    description: 'Ultra high coherence, 60s generation capabilities, complex physics interaction.',
    formatPrompt: (prompt: string) => prompt,
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine',
    company: 'Luma AI',
    badge: 'Camera Tracking',
    description: 'Fast render speeds, natural camera arcs, high keyframe consistency.',
    formatPrompt: (prompt: string) => `${prompt}, photorealistic 3D camera pan, seamless depth`,
  },
  {
    id: 'kling-ai',
    name: 'Kling AI 1.5',
    company: 'Kuaishou',
    badge: 'Complex Human Motion',
    description: 'Top-tier character expressions, realistic hand motion, dynamic physics.',
    formatPrompt: (prompt: string) => `${prompt} [motion_strength: 7]`,
  },
  {
    id: 'hailuo-minimax',
    name: 'Hailuo Minimax',
    company: 'MiniMax',
    badge: 'Cinematic Flow',
    description: 'Fluid cinematic framing, smooth character movement, rich atmospheric texture.',
    formatPrompt: (prompt: string) => prompt,
  },
];

export const FORBIDDEN_WORDS: { word: string; suggestion: string }[] = [
  { word: 'photorealistic', suggestion: 'shot on 35mm Arri Alexa 65 sensor' },
  { word: 'ultra-detailed', suggestion: 'fine pore skin texture, woven fabric micro-details' },
  { word: 'hyperrealistic', suggestion: 'volumetric rim lighting, authentic subsurface scattering' },
  { word: '8k resolution', suggestion: 'crisp 35mm anamorphic prime lens focus' },
  { word: 'unreal engine', suggestion: 'physically-based rendering, raytraced ambient occlusion' },
  { word: 'trending on artstation', suggestion: 'cinematic lighting, master composition' },
  { word: 'masterpiece', suggestion: 'cinematic 3-point studio lighting, golden ratio framing' },
];

export const SAMPLE_PROMPTS = [
  {
    title: 'Tokyo Rain Cyber-Drift',
    text: 'A midnight sports car drifting through neon-lit streets in Shinjuku during heavy rain, neon reflections on wet asphalt, steam rising from grates.',
    style: 'Cyberpunk & Sci-Fi',
    aspectRatio: '16:9',
  },
  {
    title: 'Luxury Chronograph Reveal',
    text: 'A luxury mechanical watch emerging from dark liquid gold ripples, macro shot of the ticking tourbillon escapement, crisp glass reflections and titanium casing.',
    style: 'Luxury Brand Commercial',
    aspectRatio: '16:9',
  },
  {
    title: 'TikTok UGC Coffee Machine',
    text: 'High-energy TikTok unboxing and first brew of an espresso machine with crema pouring into glass, dynamic whip pans and text hook.',
    style: 'TikTok / Social UGC Viral',
    aspectRatio: '9:16',
  },
  {
    title: 'Bioluminescent Rainforest',
    text: 'Macro probe lens moving through a nocturnal rainforest showing glowing blue fungi, translucent tree frog breathing on a mossy leaf, dew reflections.',
    style: 'National Geographic Macro',
    aspectRatio: '16:9',
  },
  {
    title: 'Deep Space Horizon Event',
    text: 'An explorer spacecraft navigating through an asteroid belt towards a shimmering gravitational gravitational lensing accretion disk around a supermassive black hole.',
    style: 'Cinematic 35mm Film',
    aspectRatio: '2.39:1',
  },
  {
    title: 'Ghibli Mountain Railway',
    text: 'A vintage red steam locomotive chugging across a stone bridge over a turquoise mountain lake, fields of wildflowers swaying in gentle afternoon wind.',
    style: 'Anime / Ghibli Aesthetic',
    aspectRatio: '16:9',
  },
];
