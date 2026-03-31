import { useEffect } from 'react';
import type { EditorMode } from '@/entities/shape';

interface UseKeyboardShortcutsParams {
  setMode: (mode: EditorMode) => void;
  undo: () => void;
  redo: () => void;
  completePolygon: () => void;
  cancelCurrentAction: () => void;
}

export const useKeyboardShortcuts = ({
  setMode,
  undo,
  redo,
  completePolygon,
  cancelCurrentAction,
}: UseKeyboardShortcutsParams): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey && e.key === 'Z') {
          e.preventDefault();
          redo();
          return;
        }
        if (e.key === 'z') {
          e.preventDefault();
          undo();
          return;
        }
      }

      switch (e.key) {
        case '1':
          setMode('point');
          break;
        case '2':
          setMode('polygon');
          break;
        case '3':
          setMode('move');
          break;
        case '4':
          setMode('delete');
          break;
        case 'Enter':
          completePolygon();
          break;
        case 'Escape':
          cancelCurrentAction();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode, undo, redo, completePolygon, cancelCurrentAction]);
};
