import React from 'react';
import { X, FolderOpen, Trash2, ExternalLink, Clock, Film, Video } from 'lucide-react';
import { VideoBlueprint } from '../types/blueprint';

interface SavedProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBlueprints: VideoBlueprint[];
  onSelectBlueprint: (bp: VideoBlueprint) => void;
  onDeleteBlueprint: (id: string) => void;
}

export const SavedProjectsDrawer: React.FC<SavedProjectsDrawerProps> = ({
  isOpen,
  onClose,
  savedBlueprints,
  onSelectBlueprint,
  onDeleteBlueprint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c0e17] border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Saved Blueprints
              </h3>
              <p className="text-[11px] text-slate-400">
                {savedBlueprints.length} project blueprints stored locally
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedBlueprints.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-400">No saved blueprints yet</p>
              <p className="text-xs text-slate-600">
                Generate a blueprint and it will automatically be saved to your local studio library.
              </p>
            </div>
          ) : (
            savedBlueprints.map((bp) => (
              <div
                key={bp.id}
                className="bg-[#07080e] border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 space-y-2 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => {
                      onSelectBlueprint(bp);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {bp.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {bp.rawUserInput}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteBlueprint(bp.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Blueprint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(bp.createdAt).toLocaleDateString()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {bp.globalSettings.aspectRatio} • {bp.scenes.length} Scenes
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
