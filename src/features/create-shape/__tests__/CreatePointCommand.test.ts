import { describe, it, expect, vi } from 'vitest';
import { CreatePointCommand } from '../model/CreatePointCommand';
import type { PointShape } from '@/entities/shape';

describe('CreatePointCommand', () => {
  const shape: PointShape = {
    id: 'test-1',
    type: 'point',
    position: { x: 100, y: 200 },
  };

  it('execute 시 도형을 추가한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new CreatePointCommand(shape, addShape, removeShape);

    command.execute();

    expect(addShape).toHaveBeenCalledWith(shape);
    expect(removeShape).not.toHaveBeenCalled();
  });

  it('undo 시 도형을 제거한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new CreatePointCommand(shape, addShape, removeShape);

    command.undo();

    expect(removeShape).toHaveBeenCalledWith('test-1');
    expect(addShape).not.toHaveBeenCalled();
  });

  it('execute → undo가 대칭적으로 동작한다', () => {
    const addShape = vi.fn();
    const removeShape = vi.fn();
    const command = new CreatePointCommand(shape, addShape, removeShape);

    command.execute();
    command.undo();

    expect(addShape).toHaveBeenCalledOnce();
    expect(removeShape).toHaveBeenCalledOnce();
  });

  it('description이 올바르다', () => {
    const command = new CreatePointCommand(shape, vi.fn(), vi.fn());
    expect(command.description).toBe('Create Point');
  });
});
