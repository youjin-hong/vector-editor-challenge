import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../lib/useKeyboardShortcuts';

const createHandlers = () => ({
  setMode: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn(),
  completePolygon: vi.fn(),
  cancelCurrentAction: vi.fn(),
});

const fireKey = (key: string, options: Partial<KeyboardEventInit> = {}): void => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
};

describe('useKeyboardShortcuts', () => {
  let handlers: ReturnType<typeof createHandlers>;

  beforeEach(() => {
    handlers = createHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
  });

  describe('모드 전환', () => {
    it('1 키를 누르면 setMode("point")를 호출한다', () => {
      fireKey('1');
      expect(handlers.setMode).toHaveBeenCalledWith('point');
    });

    it('2 키를 누르면 setMode("polygon")를 호출한다', () => {
      fireKey('2');
      expect(handlers.setMode).toHaveBeenCalledWith('polygon');
    });

    it('3 키를 누르면 setMode("move")를 호출한다', () => {
      fireKey('3');
      expect(handlers.setMode).toHaveBeenCalledWith('move');
    });

    it('4 키를 누르면 setMode("delete")를 호출한다', () => {
      fireKey('4');
      expect(handlers.setMode).toHaveBeenCalledWith('delete');
    });
  });

  describe('폴리곤 제어', () => {
    it('Enter 키를 누르면 completePolygon을 호출한다', () => {
      fireKey('Enter');
      expect(handlers.completePolygon).toHaveBeenCalledOnce();
    });

    it('Escape 키를 누르면 cancelCurrentAction을 호출한다', () => {
      fireKey('Escape');
      expect(handlers.cancelCurrentAction).toHaveBeenCalledOnce();
    });
  });

  describe('undo / redo', () => {
    it('Ctrl+Z를 누르면 undo를 호출한다', () => {
      fireKey('z', { ctrlKey: true });
      expect(handlers.undo).toHaveBeenCalledOnce();
    });

    it('Ctrl+Shift+Z를 누르면 redo를 호출한다', () => {
      fireKey('Z', { ctrlKey: true, shiftKey: true });
      expect(handlers.redo).toHaveBeenCalledOnce();
    });

    it('Mac의 Meta 키도 지원한다', () => {
      fireKey('z', { metaKey: true });
      expect(handlers.undo).toHaveBeenCalledOnce();
    });
  });

  describe('무시', () => {
    it('관련 없는 키에는 핸들러를 호출하지 않는다', () => {
      fireKey('a');
      fireKey('b');
      fireKey('5');
      expect(handlers.setMode).not.toHaveBeenCalled();
      expect(handlers.undo).not.toHaveBeenCalled();
      expect(handlers.redo).not.toHaveBeenCalled();
      expect(handlers.completePolygon).not.toHaveBeenCalled();
      expect(handlers.cancelCurrentAction).not.toHaveBeenCalled();
    });
  });
});
