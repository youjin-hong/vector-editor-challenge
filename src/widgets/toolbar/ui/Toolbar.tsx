import { Circle, Pentagon, Move, Trash2, Undo2, Redo2 } from 'lucide-react';
import type { EditorMode } from '@/entities/shape';
import { useEditorStore } from '@/app/providers/editorStore';
import { Tooltip } from '@/shared/ui/Tooltip';
import { ToolButton } from './ToolButton';
import { CompleteButton } from './CompleteButton';

const TOOLS: { mode: EditorMode; icon: typeof Circle; label: string; shortcut: string }[] = [
  { mode: 'point', icon: Circle, label: 'Point', shortcut: '1' },
  { mode: 'polygon', icon: Pentagon, label: 'Polygon', shortcut: '2' },
  { mode: 'move', icon: Move, label: 'Move', shortcut: '3' },
  { mode: 'delete', icon: Trash2, label: 'Delete', shortcut: '4' },
];

export const Toolbar = (): JSX.Element => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const canUndo = useEditorStore((s) => s.canUndo);
  const canRedo = useEditorStore((s) => s.canRedo);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const completePolygon = useEditorStore((s) => s.completePolygon);
  const pendingVertices = useEditorStore((s) => s.pendingVertices);

  return (
    <div className="fixed left-0 top-0 bottom-9 w-14 bg-editor-surface border-r border-editor-border flex flex-col items-center z-10">
      <div className="py-3 px-2 border-b border-editor-border w-full text-center">
        <span className="text-editor-accent font-bold text-sm tracking-tight">VectoR</span>
      </div>

      <div className="flex flex-col gap-1 p-1.5 w-full">
        {TOOLS.map((tool) => (
          <ToolButton
            key={tool.mode}
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            isActive={mode === tool.mode}
            onClick={() => setMode(tool.mode)}
          />
        ))}
      </div>

      {mode === 'polygon' && (
        <div className="p-1.5 w-full border-t border-editor-border">
          <CompleteButton
            onClick={completePolygon}
            disabled={pendingVertices.length < 3}
          />
        </div>
      )}

      <div className="mt-auto flex flex-col gap-1 p-1.5 w-full border-t border-editor-border">
        {([
          { icon: Undo2, label: 'Undo', shortcut: 'Ctrl+Z', onClick: undo, enabled: canUndo },
          { icon: Redo2, label: 'Redo', shortcut: 'Ctrl+Shift+Z', onClick: redo, enabled: canRedo },
        ] as const).map(({ icon: Icon, label, shortcut, onClick, enabled }) => (
          <Tooltip key={label} label={label} shortcut={shortcut}>
            <button
              onClick={onClick}
              disabled={!enabled}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all text-xs gap-1
                ${!enabled
                  ? 'opacity-30 pointer-events-none text-editor-muted'
                  : 'text-editor-secondary hover:bg-editor-surface-hover hover:text-editor-primary'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{label}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
