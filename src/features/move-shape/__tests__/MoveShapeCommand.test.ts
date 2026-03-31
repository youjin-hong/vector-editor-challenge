import { describe, it, expect, vi } from 'vitest';
import { MoveShapeCommand } from '../model/MoveShapeCommand';

describe('MoveShapeCommand', () => {
  it('execute 시 새 위치로 이동한다', () => {
    const updateShapePosition = vi.fn();
    const command = new MoveShapeCommand(
      'shape-1',
      { x: 10, y: 20 },
      { x: 50, y: 60 },
      updateShapePosition,
    );

    command.execute();

    expect(updateShapePosition).toHaveBeenCalledWith('shape-1', { x: 50, y: 60 });
  });

  it('undo 시 원래 위치로 복원한다', () => {
    const updateShapePosition = vi.fn();
    const command = new MoveShapeCommand(
      'shape-1',
      { x: 10, y: 20 },
      { x: 50, y: 60 },
      updateShapePosition,
    );

    command.undo();

    expect(updateShapePosition).toHaveBeenCalledWith('shape-1', { x: 10, y: 20 });
  });

  it('다각형 꼭짓점 배열도 처리한다', () => {
    const updateShapePosition = vi.fn();
    const from = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }];
    const to = [{ x: 50, y: 50 }, { x: 60, y: 50 }, { x: 55, y: 60 }];
    const command = new MoveShapeCommand('poly-1', from, to, updateShapePosition);

    command.execute();
    expect(updateShapePosition).toHaveBeenCalledWith('poly-1', to);

    command.undo();
    expect(updateShapePosition).toHaveBeenCalledWith('poly-1', from);
  });

  it('description이 올바르다', () => {
    const command = new MoveShapeCommand('s', { x: 0, y: 0 }, { x: 1, y: 1 }, vi.fn());
    expect(command.description).toBe('Move Shape');
  });
});
