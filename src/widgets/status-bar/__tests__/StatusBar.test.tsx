import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '../ui/StatusBar';
import { useEditorStore } from '@/app/providers/editorStore';

describe('StatusBar', () => {
  beforeEach(() => {
    useEditorStore.setState({
      mode: 'point',
      feedbackMessage: '캔버스를 클릭하여 점을 추가하세요',
    });
  });

  it('현재 모드 라벨을 표시한다', () => {
    render(<StatusBar />);
    expect(screen.getByText('Point')).toBeInTheDocument();
  });

  it('스토어의 피드백 메시지를 표시한다', () => {
    render(<StatusBar />);
    expect(screen.getByText('캔버스를 클릭하여 점을 추가하세요')).toBeInTheDocument();
  });

  it('좌표 표시 영역을 렌더링한다', () => {
    render(<StatusBar />);
    expect(screen.getByText(/X:/)).toBeInTheDocument();
    expect(screen.getByText(/Y:/)).toBeInTheDocument();
  });
});
