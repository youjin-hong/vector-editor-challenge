import { useCallback, type JSX } from "react";
import { useEditorStore } from "@/app/providers/editorStore";
import { useKeyboardShortcuts } from "@/features/history";
import { Toolbar } from "@/widgets/toolbar";
import { Canvas } from "@/widgets/canvas";
import { ThreeCanvas } from "@/widgets/three-canvas";
import { StatusBar } from "@/widgets/status-bar";

export const EditorPage = (): JSX.Element => {
  const setMode = useEditorStore((s) => s.setMode);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const completePolygon = useEditorStore((s) => s.completePolygon);
  const cancelCurrentAction = useEditorStore((s) => s.cancelCurrentAction);
  const viewMode = useEditorStore((s) => s.viewMode);
  const setViewMode = useEditorStore((s) => s.setViewMode);

  const toggleViewMode = useCallback((): void => {
    setViewMode(viewMode === "2d" ? "3d" : "2d");
  }, [viewMode, setViewMode]);

  useKeyboardShortcuts({
    setMode,
    undo,
    redo,
    completePolygon,
    cancelCurrentAction,
    toggleViewMode,
  });

  return (
    <div className="w-screen h-screen bg-editor-bg flex overflow-hidden">
      <Toolbar />
      {viewMode === "2d" ? <Canvas /> : <ThreeCanvas />}
      <StatusBar />
    </div>
  );
};
