import { create } from 'zustand';
import type { Shape, Coordinate, EditorMode, ViewMode } from '@/entities/shape';
import type { Command } from '@/shared/types';
import { HistoryManager } from '@/features/history';
import { CreatePolygonCommand } from '@/features/create-shape';
import { generateId } from '@/shared/lib/generateId';
import { MIN_POLYGON_VERTICES, FEEDBACK_MESSAGE_TIMEOUT } from '@/shared/config/constants';
import { POINT_CLOUD_SIZE } from '@/shared/config/three-constants';

const historyManager = new HistoryManager();

const historyState = (): Pick<EditorState, 'canUndo' | 'canRedo'> => ({
  canUndo: historyManager.canUndo,
  canRedo: historyManager.canRedo,
});

const MODE_MESSAGES: Record<EditorMode, string> = {
  point: '캔버스를 클릭하여 점을 추가하세요',
  polygon: '캔버스를 클릭하여 꼭짓점을 추가하세요',
  move: '도형을 드래그하여 이동하세요',
  delete: '삭제할 도형을 클릭하세요',
};

interface EditorState {
  shapes: Shape[];
  mode: EditorMode;
  selectedShapeId: string | null;
  pendingVertices: Coordinate[];
  feedbackMessage: string | null;
  canUndo: boolean;
  canRedo: boolean;
  viewMode: ViewMode;
  pointCloudVisible: boolean;
  pointSize: number;

  setMode: (mode: EditorMode) => void;
  addShape: (shape: Shape) => void;
  removeShape: (id: string) => void;
  updateShapePosition: (id: string, position: Coordinate | Coordinate[]) => void;
  addPendingVertex: (vertex: Coordinate) => void;
  clearPendingVertices: () => void;
  completePolygon: () => void;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  setFeedbackMessage: (message: string | null) => void;
  cancelCurrentAction: () => void;
  setViewMode: (mode: ViewMode) => void;
  togglePointCloud: () => void;
  setPointSize: (size: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  shapes: [],
  mode: 'point',
  selectedShapeId: null,
  pendingVertices: [],
  feedbackMessage: MODE_MESSAGES.point,
  canUndo: false,
  canRedo: false,
  viewMode: '2d',
  pointCloudVisible: true,
  pointSize: POINT_CLOUD_SIZE,

  setMode: (mode) => {
    set({
      mode,
      selectedShapeId: null,
      pendingVertices: [],
      feedbackMessage: MODE_MESSAGES[mode],
    });
  },

  addShape: (shape) => {
    set((state) => ({ shapes: [...state.shapes, shape] }));
  },

  removeShape: (id) => {
    set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) }));
  },

  updateShapePosition: (id, position) => {
    set((state) => ({
      shapes: state.shapes.map((shape) => {
        if (shape.id !== id) return shape;
        if (shape.type === 'point' && !Array.isArray(position)) {
          return { ...shape, position };
        }
        if (shape.type === 'polygon' && Array.isArray(position)) {
          return { ...shape, vertices: position };
        }
        return shape;
      }),
    }));
  },

  addPendingVertex: (vertex) => {
    set((state) => ({
      pendingVertices: [...state.pendingVertices, vertex],
      feedbackMessage: `꼭짓점 ${state.pendingVertices.length + 1}개 추가됨 (최소 ${MIN_POLYGON_VERTICES}개 필요)`,
    }));
  },

  clearPendingVertices: () => {
    set({ pendingVertices: [] });
  },

  completePolygon: () => {
    const state = get();
    if (state.mode !== 'polygon') return;

    if (state.pendingVertices.length < MIN_POLYGON_VERTICES) {
      set({
        feedbackMessage:
          state.pendingVertices.length === 0
            ? MODE_MESSAGES.polygon
            : `꼭짓점이 ${state.pendingVertices.length}개뿐입니다. 최소 ${MIN_POLYGON_VERTICES}개가 필요합니다.`,
      });
      return;
    }

    const polygon = {
      id: generateId(),
      type: 'polygon' as const,
      vertices: [...state.pendingVertices],
    };

    const command = new CreatePolygonCommand(
      polygon,
      get().addShape,
      get().removeShape,
    );

    historyManager.execute(command);
    set({
      pendingVertices: [],
      ...historyState(),
      feedbackMessage: '다각형이 생성되었습니다',
    });

    setTimeout(() => {
      set({ feedbackMessage: MODE_MESSAGES.polygon });
    }, FEEDBACK_MESSAGE_TIMEOUT);
  },

  executeCommand: (command) => {
    historyManager.execute(command);
    set(historyState());
  },

  undo: () => {
    if (!historyManager.canUndo) return;
    historyManager.undo();
    set(historyState());
  },

  redo: () => {
    if (!historyManager.canRedo) return;
    historyManager.redo();
    set(historyState());
  },

  setFeedbackMessage: (message) => {
    set({ feedbackMessage: message });
  },

  cancelCurrentAction: () => {
    const state = get();
    if (state.pendingVertices.length > 0) {
      set({
        pendingVertices: [],
        feedbackMessage: MODE_MESSAGES[state.mode],
      });
    }
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  togglePointCloud: () => {
    set((state) => ({ pointCloudVisible: !state.pointCloudVisible }));
  },

  setPointSize: (pointSize) => {
    set({ pointSize });
  },
}));
