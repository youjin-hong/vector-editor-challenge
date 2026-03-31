import { useState, useCallback, useRef } from 'react';
import type { Coordinate, Shape } from '@/entities/shape';
import { clampToCanvas } from '@/entities/shape';
import { MoveShapeCommand } from '../model/MoveShapeCommand';

const isPositionChanged = (
  a: Coordinate | Coordinate[],
  b: Coordinate | Coordinate[],
): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length !== b.length || a.some((v, i) => v.x !== b[i].x || v.y !== b[i].y);
  }
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return a.x !== b.x || a.y !== b.y;
  }
  return true;
};

interface DragState {
  shapeId: string;
  startMousePos: Coordinate;
  originalPosition: Coordinate | Coordinate[];
}

interface UseDragDropParams {
  shapes: Shape[];
  updateShapePosition: (id: string, position: Coordinate | Coordinate[]) => void;
  executeCommand: (command: MoveShapeCommand) => void;
  canvasWidth: number;
  canvasHeight: number;
}

interface UseDragDropReturn {
  isDragging: boolean;
  dragShapeId: string | null;
  handleDragStart: (shape: Shape, mousePos: Coordinate) => void;
  handleDragMove: (mousePos: Coordinate) => void;
  handleDragEnd: () => void;
}

export const useDragDrop = ({
  shapes,
  updateShapePosition,
  executeCommand,
  canvasWidth,
  canvasHeight,
}: UseDragDropParams): UseDragDropReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragShapeId, setDragShapeId] = useState<string | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const handleDragStart = useCallback((shape: Shape, mousePos: Coordinate): void => {
    const originalPosition = shape.type === 'point' ? shape.position : shape.vertices;
    dragStateRef.current = {
      shapeId: shape.id,
      startMousePos: mousePos,
      originalPosition,
    };
    setIsDragging(true);
    setDragShapeId(shape.id);
  }, []);

  const handleDragMove = useCallback((mousePos: Coordinate): void => {
    const state = dragStateRef.current;
    if (!state) return;

    const dx = mousePos.x - state.startMousePos.x;
    const dy = mousePos.y - state.startMousePos.y;

    const shape = shapes.find((s) => s.id === state.shapeId);
    if (!shape) return;

    if (shape.type === 'point') {
      const original = state.originalPosition as Coordinate;
      const newPos = clampToCanvas(
        { x: original.x + dx, y: original.y + dy },
        canvasWidth,
        canvasHeight,
      );
      updateShapePosition(state.shapeId, newPos);
    } else {
      const original = state.originalPosition as Coordinate[];
      const newVertices = original.map((v) =>
        clampToCanvas(
          { x: v.x + dx, y: v.y + dy },
          canvasWidth,
          canvasHeight,
        ),
      );
      updateShapePosition(state.shapeId, newVertices);
    }
  }, [shapes, updateShapePosition, canvasWidth, canvasHeight]);

  const handleDragEnd = useCallback((): void => {
    const state = dragStateRef.current;
    if (!state) return;

    const shape = shapes.find((s) => s.id === state.shapeId);
    if (!shape) return;

    const currentPosition = shape.type === 'point' ? shape.position : shape.vertices;

    const hasChanged = isPositionChanged(currentPosition, state.originalPosition);
    if (hasChanged) {
      updateShapePosition(state.shapeId, state.originalPosition);
      const command = new MoveShapeCommand(
        state.shapeId,
        state.originalPosition,
        currentPosition,
        updateShapePosition,
      );
      executeCommand(command);
    }

    dragStateRef.current = null;
    setIsDragging(false);
    setDragShapeId(null);
  }, [shapes, updateShapePosition, executeCommand]);

  return {
    isDragging,
    dragShapeId,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};
