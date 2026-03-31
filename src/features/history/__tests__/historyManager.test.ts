import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistoryManager } from '../model/historyManager';
import type { Command } from '@/shared/types';

const createMockCommand = (): Command & { executeCalls: number; undoCalls: number } => {
  const mock = {
    description: 'mock',
    executeCalls: 0,
    undoCalls: 0,
    execute: vi.fn(() => { mock.executeCalls++; }),
    undo: vi.fn(() => { mock.undoCalls++; }),
  };
  return mock;
};

describe('HistoryManager', () => {
  let manager: HistoryManager;

  beforeEach(() => {
    manager = new HistoryManager();
  });

  it('초기 상태에서 스택이 비어있다', () => {
    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(false);
  });

  it('커맨드를 실행하고 undo 스택에 추가한다', () => {
    const command = createMockCommand();
    manager.execute(command);
    expect(command.execute).toHaveBeenCalledOnce();
    expect(manager.canUndo).toBe(true);
  });

  it('마지막 커맨드를 undo한다', () => {
    const command = createMockCommand();
    manager.execute(command);
    manager.undo();
    expect(command.undo).toHaveBeenCalledOnce();
    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(true);
  });

  it('마지막으로 undo한 커맨드를 redo한다', () => {
    const command = createMockCommand();
    manager.execute(command);
    manager.undo();
    manager.redo();
    expect(command.execute).toHaveBeenCalledTimes(2);
    expect(manager.canUndo).toBe(true);
    expect(manager.canRedo).toBe(false);
  });

  it('undo 후 새 커맨드 실행 시 redo 스택을 비운다', () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    manager.execute(cmd1);
    manager.undo();
    expect(manager.canRedo).toBe(true);
    manager.execute(cmd2);
    expect(manager.canRedo).toBe(false);
  });

  it('빈 스택에서 undo해도 아무 일 없다', () => {
    manager.undo();
    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(false);
  });

  it('빈 스택에서 redo해도 아무 일 없다', () => {
    manager.redo();
    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(false);
  });

  it('여러 번 연속 undo를 처리한다', () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    const cmd3 = createMockCommand();
    manager.execute(cmd1);
    manager.execute(cmd2);
    manager.execute(cmd3);
    expect(manager.canUndo).toBe(true);

    manager.undo();
    expect(cmd3.undo).toHaveBeenCalledOnce();
    manager.undo();
    expect(cmd2.undo).toHaveBeenCalledOnce();
    manager.undo();
    expect(cmd1.undo).toHaveBeenCalledOnce();

    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(true);
  });

  it('undo → redo → 새 실행 순서를 처리한다', () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    manager.execute(cmd1);
    manager.execute(cmd2);
    manager.undo();
    manager.undo();
    manager.redo();

    const cmd3 = createMockCommand();
    manager.execute(cmd3);

    expect(manager.canRedo).toBe(false);
    expect(manager.canUndo).toBe(true);
  });

  it('clear() 호출 시 모든 스택을 비운다', () => {
    manager.execute(createMockCommand());
    manager.execute(createMockCommand());
    manager.undo();
    manager.clear();

    expect(manager.canUndo).toBe(false);
    expect(manager.canRedo).toBe(false);
  });
});
