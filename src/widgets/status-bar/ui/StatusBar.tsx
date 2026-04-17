import { useState, useEffect, useRef, useCallback, type JSX } from 'react';
import { useEditorStore } from '@/app/providers/editorStore';
import { TOOLBAR_WIDTH, STATUS_BAR_HEIGHT, MODE_LABELS } from '@/shared/config/constants';

export const StatusBar = (): JSX.Element => {
  const mode = useEditorStore((s) => s.mode);
  const feedbackMessage = useEditorStore((s) => s.feedbackMessage);
  const viewMode = useEditorStore((s) => s.viewMode);
  const shapes = useEditorStore((s) => s.shapes);
  const pointSize = useEditorStore((s) => s.pointSize);
  const setPointSize = useEditorStore((s) => s.setPointSize);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setMousePos({
          x: Math.round(e.clientX - TOOLBAR_WIDTH),
          y: Math.round(e.clientY),
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setPointSize(parseFloat(e.target.value));
    },
    [setPointSize],
  );

  return (
    <div
      className="fixed bottom-0 right-0 flex items-center justify-between px-4 bg-editor-surface border-t border-editor-border text-xs"
      style={{
        left: TOOLBAR_WIDTH,
        height: STATUS_BAR_HEIGHT,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-editor-accent/20 text-editor-accent font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-editor-accent" />
          {MODE_LABELS[mode]}
        </span>
        {viewMode === '3d' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-editor-surface-hover text-editor-secondary font-mono">
            Shapes: {shapes.length}
          </span>
        )}
        <span className="text-editor-secondary">{feedbackMessage}</span>
      </div>
      <div className="flex items-center gap-3">
        {viewMode === '3d' && (
          <div className="flex items-center gap-2 text-editor-muted">
            <span className="text-editor-secondary">Point Size</span>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.005"
              value={pointSize}
              onChange={handlePointSizeChange}
              className="w-20 h-1 accent-editor-accent"
            />
            <span className="font-mono w-8 text-right">{pointSize.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-editor-muted font-mono">
          <span>X: {mousePos.x}</span>
          <span>|</span>
          <span>Y: {mousePos.y}</span>
          {viewMode === '3d' && (
            <>
              <span>|</span>
              <span>Z: 0</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
