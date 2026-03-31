import { useCallback, useState } from 'react';
import type { Coordinate } from '@/entities/shape';
import { findShapeAtPoint } from '@/entities/shape';
import { useEditorStore } from '@/app/providers/editorStore';
import { CreatePointCommand } from '@/features/create-shape';
import { DeleteShapeCommand } from '@/features/delete-shape';
import { useDragDrop } from '@/features/move-shape';
import { generateId } from '@/shared/lib/generateId';

interface UseCanvasInteractionReturn {
  hoveredShapeId: string | null;
  isDragging: boolean;
  dragShapeId: string | null;
  mousePos: Coordinate | null;
  handleMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

export const useCanvasInteraction = (
  canvasWidth: number,
  canvasHeight: number,
): UseCanvasInteractionReturn => {
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Coordinate | null>(null);

  const mode = useEditorStore((s) => s.mode);
  const shapes = useEditorStore((s) => s.shapes);
  const addShape = useEditorStore((s) => s.addShape);
  const removeShape = useEditorStore((s) => s.removeShape);
  const updateShapePosition = useEditorStore((s) => s.updateShapePosition);
  const addPendingVertex = useEditorStore((s) => s.addPendingVertex);
  const executeCommand = useEditorStore((s) => s.executeCommand);

  const { isDragging, dragShapeId, handleDragStart, handleDragMove, handleDragEnd } = useDragDrop({
    shapes,
    updateShapePosition,
    executeCommand,
    canvasWidth,
    canvasHeight,
  });

  const getSvgCoord = useCallback((e: React.MouseEvent<SVGSVGElement>): Coordinate => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>): void => {
      const coord = getSvgCoord(e);

      switch (mode) {
        case 'point': {
          const point = {
            id: generateId(),
            type: 'point' as const,
            position: coord,
          };
          const command = new CreatePointCommand(point, addShape, removeShape);
          executeCommand(command);
          break;
        }

        case 'polygon': {
          addPendingVertex(coord);
          break;
        }

        case 'move': {
          const shape = findShapeAtPoint(coord, shapes);
          if (shape) {
            handleDragStart(shape, coord);
          }
          break;
        }

        case 'delete': {
          const targetShape = findShapeAtPoint(coord, shapes);
          if (targetShape) {
            const command = new DeleteShapeCommand(targetShape, addShape, removeShape);
            executeCommand(command);
          }
          break;
        }
      }
    },
    [mode, shapes, getSvgCoord, addShape, removeShape, executeCommand, addPendingVertex, handleDragStart],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>): void => {
      const coord = getSvgCoord(e);
      setMousePos(coord);

      if (isDragging) {
        handleDragMove(coord);
        return;
      }

      if (mode === 'move' || mode === 'delete') {
        const shape = findShapeAtPoint(coord, shapes);
        setHoveredShapeId(shape?.id ?? null);
      } else {
        setHoveredShapeId(null);
      }
    },
    [mode, shapes, isDragging, getSvgCoord, handleDragMove],
  );

  const handleMouseUp = useCallback((): void => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  const handleMouseLeave = useCallback((): void => {
    setMousePos(null);
    setHoveredShapeId(null);
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  return {
    hoveredShapeId,
    isDragging,
    dragShapeId,
    mousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};
