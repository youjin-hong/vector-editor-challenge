import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../ui/Toolbar';
import { useEditorStore } from '@/app/providers/editorStore';

// Tooltip이 같은 텍스트를 렌더링하므로 버튼 내부 span만 선택한다
const getButtonByLabel = (label: string): HTMLButtonElement => {
  const spans = screen.getAllByText(label);
  // 버튼 내부 span은 leading-none 클래스를 가짐
  const buttonSpan = spans.find((el) =>
    el.closest('button') && el.classList.contains('leading-none'),
  );
  return buttonSpan!.closest('button')!;
};

describe('Toolbar', () => {
  beforeEach(() => {
    useEditorStore.setState({
      shapes: [],
      mode: 'point',
      selectedShapeId: null,
      pendingVertices: [],
      feedbackMessage: '',
      canUndo: false,
      canRedo: false,
    });
  });

  it('4개의 도구 버튼을 렌더링한다', () => {
    render(<Toolbar />);
    expect(getButtonByLabel('Point')).toBeInTheDocument();
    expect(getButtonByLabel('Polygon')).toBeInTheDocument();
    expect(getButtonByLabel('Move')).toBeInTheDocument();
    expect(getButtonByLabel('Delete')).toBeInTheDocument();
  });

  it('Undo, Redo 버튼을 렌더링한다', () => {
    render(<Toolbar />);
    expect(getButtonByLabel('Undo')).toBeInTheDocument();
    expect(getButtonByLabel('Redo')).toBeInTheDocument();
  });

  it('활성 모드 버튼을 강조 표시한다', () => {
    render(<Toolbar />);
    const pointButton = getButtonByLabel('Point');
    expect(pointButton.className).toContain('bg-editor-accent');
  });

  it('도구 버튼 클릭 시 모드를 전환한다', () => {
    render(<Toolbar />);
    fireEvent.click(getButtonByLabel('Polygon'));
    expect(useEditorStore.getState().mode).toBe('polygon');
  });

  it('polygon 모드에서만 CompleteButton을 표시한다', () => {
    const { rerender } = render(<Toolbar />);
    expect(screen.queryByText('Done')).not.toBeInTheDocument();

    useEditorStore.setState({ mode: 'polygon' });
    rerender(<Toolbar />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('pendingVertices가 3개 미만이면 CompleteButton을 비활성화한다', () => {
    useEditorStore.setState({
      mode: 'polygon',
      pendingVertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
    });
    render(<Toolbar />);
    const doneButton = screen.getByText('Done').closest('button')!;
    expect(doneButton).toBeDisabled();
  });

  it('pendingVertices가 3개 이상이면 CompleteButton을 활성화한다', () => {
    useEditorStore.setState({
      mode: 'polygon',
      pendingVertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 },
      ],
    });
    render(<Toolbar />);
    const doneButton = screen.getByText('Done').closest('button')!;
    expect(doneButton).not.toBeDisabled();
  });

  it('canUndo가 false면 Undo 버튼을 비활성화한다', () => {
    render(<Toolbar />);
    const undoButton = getButtonByLabel('Undo');
    expect(undoButton).toBeDisabled();
  });

  it('canRedo가 false면 Redo 버튼을 비활성화한다', () => {
    render(<Toolbar />);
    const redoButton = getButtonByLabel('Redo');
    expect(redoButton).toBeDisabled();
  });

  it('canUndo가 true면 Undo 버튼을 활성화한다', () => {
    useEditorStore.setState({ canUndo: true });
    render(<Toolbar />);
    const undoButton = getButtonByLabel('Undo');
    expect(undoButton).not.toBeDisabled();
  });
});
