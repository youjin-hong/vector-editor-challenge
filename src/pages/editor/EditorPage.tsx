import type { JSX } from 'react';
import { useEditorStore } from '@/app/providers/editorStore';
import { useKeyboardShortcuts } from '@/features/history';
import { Toolbar } from '@/widgets/toolbar';
import { Canvas } from '@/widgets/canvas';
import { StatusBar } from '@/widgets/status-bar';

export const EditorPage = (): JSX.Element => {
  const setMode = useEditorStore((s) => s.setMode);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const completePolygon = useEditorStore((s) => s.completePolygon);
  const cancelCurrentAction = useEditorStore((s) => s.cancelCurrentAction);

  useKeyboardShortcuts({
    setMode,
    undo,
    redo,
    completePolygon,
    cancelCurrentAction,
  });

  return (
    <div className="w-screen h-screen bg-editor-bg flex overflow-hidden">
      <Toolbar />
      <Canvas />
      <StatusBar />
    </div>
  );
};
