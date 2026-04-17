import { useCallback } from 'react';
import { useEditorStore } from '@/app/providers/editorStore';
import { DeleteShapeCommand } from '@/features/delete-shape';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * 3D 씬에서 기존 shape를 클릭했을 때 삭제 처리용 핸들러 생성
 */
export const useShapeClickHandler = (
  shapeId: string,
): { handleClick: (e: ThreeEvent<MouseEvent>) => void } => {
  const mode = useEditorStore((s) => s.mode);
  const shapes = useEditorStore((s) => s.shapes);
  const addShape = useEditorStore((s) => s.addShape);
  const removeShape = useEditorStore((s) => s.removeShape);
  const executeCommand = useEditorStore((s) => s.executeCommand);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>): void => {
      if (mode !== 'delete') return;
      e.stopPropagation();

      const shape = shapes.find((s) => s.id === shapeId);
      if (!shape) return;

      const command = new DeleteShapeCommand(shape, addShape, removeShape);
      executeCommand(command);
    },
    [mode, shapes, shapeId, addShape, removeShape, executeCommand],
  );

  return { handleClick };
};
