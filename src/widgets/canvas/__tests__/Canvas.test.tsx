import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '../ui/Canvas';
import { useEditorStore } from '@/app/providers/editorStore';
import type { PointShape, PolygonShape } from '@/entities/shape';

// Canvas가 SVG를 렌더링하도록 clientWidth/clientHeight를 모킹
const mockDimensions = (): void => {
  Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { value: 800, configurable: true });
  Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { value: 600, configurable: true });
};

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

describe('Canvas', () => {
  beforeEach(() => {
    mockDimensions();
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

  it('크기가 0보다 크면 SVG를 렌더링한다', () => {
    const { container } = render(<Canvas />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('스토어의 점 도형을 렌더링한다', () => {
    useEditorStore.setState({ shapes: [pointShape] });
    const { container } = render(<Canvas />);
    const circle = container.querySelector('circle[data-shape-id="pt-1"]');
    expect(circle).toBeInTheDocument();
  });

  it('스토어의 다각형 도형을 렌더링한다', () => {
    useEditorStore.setState({ shapes: [polygonShape] });
    const { container } = render(<Canvas />);
    const polygon = container.querySelector('polygon[data-shape-id="poly-1"]');
    expect(polygon).toBeInTheDocument();
  });

  it('미완성 다각형의 프리뷰 꼭짓점을 렌더링한다', () => {
    useEditorStore.setState({
      mode: 'polygon',
      pendingVertices: [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ],
    });
    const { container } = render(<Canvas />);
    // 미완성 꼭짓점은 data-shape-id 없는 작은 원으로 렌더링됨
    const pendingCircles = container.querySelectorAll('circle:not([data-shape-id])');
    // 그리드 점(r=1) 제외 — 미완성 꼭짓점은 r=4
    const vertexCircles = Array.from(pendingCircles).filter(
      (c) => c.getAttribute('r') === '4',
    );
    expect(vertexCircles).toHaveLength(3);
  });

  it('미완성 다각형의 프리뷰 polyline을 렌더링한다', () => {
    useEditorStore.setState({
      mode: 'polygon',
      pendingVertices: [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ],
    });
    const { container } = render(<Canvas />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
    expect(polyline!.getAttribute('points')).toBe('10,20 30,40');
  });

  it('point 모드에서 crosshair 커서를 적용한다', () => {
    const { container } = render(<Canvas />);
    const svg = container.querySelector('svg')!;
    expect(svg.style.cursor).toBe('crosshair');
  });

  it('polygon 모드에서 crosshair 커서를 적용한다', () => {
    useEditorStore.setState({ mode: 'polygon' });
    const { container } = render(<Canvas />);
    const svg = container.querySelector('svg')!;
    expect(svg.style.cursor).toBe('crosshair');
  });

  it('move 모드에서 default 커서를 적용한다', () => {
    useEditorStore.setState({ mode: 'move' });
    const { container } = render(<Canvas />);
    const svg = container.querySelector('svg')!;
    expect(svg.style.cursor).toBe('default');
  });
});
