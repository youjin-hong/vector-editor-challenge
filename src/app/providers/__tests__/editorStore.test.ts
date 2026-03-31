import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEditorStore } from '../editorStore';
import type { Command } from '@/shared/types';
import type { PointShape, PolygonShape } from '@/entities/shape';
import { MIN_POLYGON_VERTICES } from '@/shared/config/constants';

const createMockCommand = (): Command => ({
  description: 'mock',
  execute: vi.fn(),
  undo: vi.fn(),
});

const pointShape: PointShape = {
  id: 'pt-1',
  type: 'point',
  position: { x: 100, y: 200 },
};

const polygonShape: PolygonShape = {
  id: 'poly-1',
  type: 'polygon',
  vertices: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 50, y: 100 },
  ],
};

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      shapes: [],
      mode: 'point',
      selectedShapeId: null,
      pendingVertices: [],
      feedbackMessage: '캔버스를 클릭하여 점을 추가하세요',
      canUndo: false,
      canRedo: false,
    });
  });

  describe('초기 상태', () => {
    it('기본 모드가 point다', () => {
      expect(useEditorStore.getState().mode).toBe('point');
    });

    it('shapes가 빈 배열이다', () => {
      expect(useEditorStore.getState().shapes).toEqual([]);
    });

    it('기본 피드백 메시지가 설정되어 있다', () => {
      expect(useEditorStore.getState().feedbackMessage).toBe(
        '캔버스를 클릭하여 점을 추가하세요',
      );
    });
  });

  describe('setMode', () => {
    it('모드를 변경한다', () => {
      useEditorStore.getState().setMode('polygon');
      expect(useEditorStore.getState().mode).toBe('polygon');
    });

    it('모드 전환 시 pendingVertices를 비운다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [{ x: 10, y: 20 }],
      });
      useEditorStore.getState().setMode('point');
      expect(useEditorStore.getState().pendingVertices).toEqual([]);
    });

    it('selectedShapeId를 null로 초기화한다', () => {
      useEditorStore.setState({ selectedShapeId: 'some-id' });
      useEditorStore.getState().setMode('move');
      expect(useEditorStore.getState().selectedShapeId).toBeNull();
    });

    it('해당 모드의 피드백 메시지로 변경한다', () => {
      useEditorStore.getState().setMode('delete');
      expect(useEditorStore.getState().feedbackMessage).toBe(
        '삭제할 도형을 클릭하세요',
      );
    });
  });

  describe('addShape / removeShape', () => {
    it('shapes 배열에 도형을 추가한다', () => {
      useEditorStore.getState().addShape(pointShape);
      expect(useEditorStore.getState().shapes).toHaveLength(1);
      expect(useEditorStore.getState().shapes[0]).toEqual(pointShape);
    });

    it('id로 도형을 제거한다', () => {
      useEditorStore.setState({ shapes: [pointShape] });
      useEditorStore.getState().removeShape('pt-1');
      expect(useEditorStore.getState().shapes).toHaveLength(0);
    });

    it('없는 id를 제거해도 에러가 발생하지 않는다', () => {
      useEditorStore.setState({ shapes: [pointShape] });
      useEditorStore.getState().removeShape('non-existent');
      expect(useEditorStore.getState().shapes).toHaveLength(1);
    });
  });

  describe('updateShapePosition', () => {
    it('점의 위치를 업데이트한다', () => {
      useEditorStore.setState({ shapes: [pointShape] });
      useEditorStore.getState().updateShapePosition('pt-1', { x: 300, y: 400 });
      const updated = useEditorStore.getState().shapes[0] as PointShape;
      expect(updated.position).toEqual({ x: 300, y: 400 });
    });

    it('다각형 꼭짓점을 업데이트한다', () => {
      useEditorStore.setState({ shapes: [polygonShape] });
      const newVertices = [
        { x: 10, y: 10 },
        { x: 110, y: 10 },
        { x: 60, y: 110 },
      ];
      useEditorStore.getState().updateShapePosition('poly-1', newVertices);
      const updated = useEditorStore.getState().shapes[0] as PolygonShape;
      expect(updated.vertices).toEqual(newVertices);
    });
  });

  describe('addPendingVertex', () => {
    it('pendingVertices에 꼭짓점을 추가한다', () => {
      useEditorStore.getState().addPendingVertex({ x: 10, y: 20 });
      expect(useEditorStore.getState().pendingVertices).toEqual([{ x: 10, y: 20 }]);
    });

    it('꼭짓점 수가 포함된 피드백 메시지를 표시한다', () => {
      useEditorStore.getState().addPendingVertex({ x: 10, y: 20 });
      expect(useEditorStore.getState().feedbackMessage).toContain('1');
      expect(useEditorStore.getState().feedbackMessage).toContain(
        `${MIN_POLYGON_VERTICES}`,
      );
    });
  });

  describe('completePolygon', () => {
    it('꼭짓점 3개 이상이면 다각형을 생성한다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 50, y: 100 },
        ],
      });
      useEditorStore.getState().completePolygon();
      const shapes = useEditorStore.getState().shapes;
      expect(shapes).toHaveLength(1);
      expect(shapes[0].type).toBe('polygon');
    });

    it('꼭짓점 3개 미만이면 생성을 거부하고 경고한다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [{ x: 0, y: 0 }, { x: 100, y: 0 }],
      });
      useEditorStore.getState().completePolygon();
      expect(useEditorStore.getState().shapes).toHaveLength(0);
      expect(useEditorStore.getState().feedbackMessage).toContain('2');
    });

    it('polygon 모드가 아니면 아무 일 없다', () => {
      useEditorStore.setState({
        mode: 'point',
        pendingVertices: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 50, y: 100 },
        ],
      });
      useEditorStore.getState().completePolygon();
      expect(useEditorStore.getState().shapes).toHaveLength(0);
    });

    it('완성 후 pendingVertices를 비운다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 50, y: 100 },
        ],
      });
      useEditorStore.getState().completePolygon();
      expect(useEditorStore.getState().pendingVertices).toEqual([]);
    });

    it('완성 후 canUndo가 true가 된다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 50, y: 100 },
        ],
      });
      useEditorStore.getState().completePolygon();
      expect(useEditorStore.getState().canUndo).toBe(true);
    });
  });

  describe('executeCommand / undo / redo', () => {
    it('커맨드를 실행하고 canUndo를 true로 설정한다', () => {
      const command = createMockCommand();
      useEditorStore.getState().executeCommand(command);
      expect(command.execute).toHaveBeenCalledOnce();
      expect(useEditorStore.getState().canUndo).toBe(true);
    });

    it('마지막 커맨드를 undo하고 canRedo를 true로 설정한다', () => {
      const command = createMockCommand();
      useEditorStore.getState().executeCommand(command);
      useEditorStore.getState().undo();
      expect(command.undo).toHaveBeenCalledOnce();
      expect(useEditorStore.getState().canRedo).toBe(true);
    });

    it('undo된 커맨드를 redo한다', () => {
      const command = createMockCommand();
      useEditorStore.getState().executeCommand(command);
      useEditorStore.getState().undo();
      useEditorStore.getState().redo();
      expect(command.execute).toHaveBeenCalledTimes(2);
      expect(useEditorStore.getState().canUndo).toBe(true);
      expect(useEditorStore.getState().canRedo).toBe(false);
    });

    it('undo 후 새 실행 시 redoStack을 비운다', () => {
      const cmd1 = createMockCommand();
      const cmd2 = createMockCommand();
      useEditorStore.getState().executeCommand(cmd1);
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().canRedo).toBe(true);
      useEditorStore.getState().executeCommand(cmd2);
      expect(useEditorStore.getState().canRedo).toBe(false);
    });
  });

  describe('cancelCurrentAction', () => {
    it('pendingVertices를 비운다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [{ x: 10, y: 20 }],
      });
      useEditorStore.getState().cancelCurrentAction();
      expect(useEditorStore.getState().pendingVertices).toEqual([]);
    });

    it('현재 모드의 피드백 메시지로 초기화한다', () => {
      useEditorStore.setState({
        mode: 'polygon',
        pendingVertices: [{ x: 10, y: 20 }],
        feedbackMessage: '꼭짓점 1개 추가됨',
      });
      useEditorStore.getState().cancelCurrentAction();
      expect(useEditorStore.getState().feedbackMessage).toBe(
        '캔버스를 클릭하여 꼭짓점을 추가하세요',
      );
    });
  });
});
