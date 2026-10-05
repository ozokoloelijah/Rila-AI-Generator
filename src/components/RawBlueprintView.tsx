import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Code } from 'lucide-react';
import { VideoBlueprint } from '../types/blueprint';

interface RawBlueprintViewProps {
  blueprint: VideoBlueprint;
}

export const RawBlueprintView: React.FC<RawBlueprintViewProps> = ({ blueprint }) => {
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Fallback to synthesizing the exact format if formattedOutput is missing
  const fullText = React.useMemo(() => {
    if (blueprint.formattedOutput && blueprint.formattedOutput.trim().startsWith('[Global Video Settings]')) {
      return blueprint.formattedOutput.trim();
    }

    return `1. [Global Video Settings]:
- Aspect Ratio: ${blueprint.globalSettings.aspectRatio}
- Estimated Duration: ${blueprint.globalSettings.estimatedDuration}
- Style: ${blueprint.globalSettings.style}
- Recommended Frame Rate: ${blueprint.globalSettings.recommendedFrameRate}

2. [AI Video Prompt]:
${blueprint.masterPrompt}

3. [Scene-by-Scene Breakdown]:
${blueprint.scenes
  .map(
    (s) => `Scene ${s.sceneNumber}:
- Time Stamp: ${s.timeStamp}
- Visual Scene Prompt: ${s.visualScenePrompt}
- Camera Motion: ${s.cameraMotion}
- Audio/SFX: ${s.audioSfx}`
  )
  .join('\n\n')}`;
  }, [blueprint]);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rila-blueprint-${blueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rila-blueprint-${blueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Verbatim Production Blueprint (Direct Output)
          </h3>
          <p className="text-[11px] text-slate-400">
            Raw structured format with zero conversational filler, ready for pipeline ingestion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Copy as JSON"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied JSON</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleCopyRaw}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verbatim output container */}
      <div className="relative">
        <pre className="p-4 sm:p-5 rounded-xl bg-[#06070a] border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {fullText}
        </pre>
      </div>
    </div>
  );
};
