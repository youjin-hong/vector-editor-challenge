import { describe, it, expect, vi } from 'vitest';
import { DeleteShapeCommand } from '../model/DeleteShapeCommand';
import type { PointShape, PolygonShape } from '@/entities/shape';

describe('DeleteShapeCommand', () => {
  const pointShape: PointShape = {
    id: 'pt-1',
    type: 'point',
    position: { x: 100, y: 200 },
  };

  it('execute 시 도형을 제거한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new DeleteShapeCommand(pointShape, addShape, removeShape);

    command.execute();

    expect(removeShape).toHaveBeenCalledWith('pt-1');
    expect(addShape).not.toHaveBeenCalled();
  });

  it('undo 시 도형을 복원한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new DeleteShapeCommand(pointShape, addShape, removeShape);

    command.undo();

    expect(addShape).toHaveBeenCalledWith(pointShape);
    expect(removeShape).not.toHaveBeenCalled();
  });

  it('undo 시 다각형 데이터가 보존된다', () => {
    const polygonShape: PolygonShape = {
      id: 'poly-1',
      type: 'polygon',
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 },
      ],
    };
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new DeleteShapeCommand(polygonShape, addShape, removeShape);

    command.execute();
    command.undo();

    expect(addShape).toHaveBeenCalledWith(polygonShape);
    expect(addShape.mock.calls[0][0].vertices).toHaveLength(3);
  });

  it('description이 올바르다', () => {
    const command = new DeleteShapeCommand(pointShape, vi.fn(), vi.fn());
    expect(command.description).toBe('Delete Shape');
  });
});
