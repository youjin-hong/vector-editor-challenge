import { describe, it, expect, vi } from 'vitest';
import { CreatePolygonCommand } from '../model/CreatePolygonCommand';
import type { PolygonShape } from '@/entities/shape';

describe('CreatePolygonCommand', () => {
  const shape: PolygonShape = {
    id: 'poly-1',
    type: 'polygon',
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 100 },
    ],
  };

  it('execute 시 다각형을 추가한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new CreatePolygonCommand(shape, addShape, removeShape);

    command.execute();

    expect(addShape).toHaveBeenCalledWith(shape);
  });

  it('undo 시 다각형을 제거한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new CreatePolygonCommand(shape, addShape, removeShape);

    command.undo();

    expect(removeShape).toHaveBeenCalledWith('poly-1');
  });

  it('description이 올바르다', () => {
    const command = new CreatePolygonCommand(shape, vi.fn(), vi.fn());
    expect(command.description).toBe('Create Polygon');
  });
});
