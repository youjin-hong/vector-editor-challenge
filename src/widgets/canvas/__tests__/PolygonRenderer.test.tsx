import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PolygonRenderer } from '../ui/PolygonRenderer';
import { COLORS } from '@/shared/config/constants';
import type { PolygonShape } from '@/entities/shape';

const shape: PolygonShape = {
  id: 'poly-1',
  type: 'polygon',
  vertices: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 50, y: 100 },
  ],
};

const renderPolygon = (isHovered = false, isDragging = false) => {
  const { container } = render(
    <svg>
      <PolygonRenderer shape={shape} isHovered={isHovered} isDragging={isDragging} />
    </svg>,
  );
  return container.querySelector('polygon')!;
};

describe('PolygonRenderer', () => {
  it('올바른 points 속성으로 polygon을 렌더링한다', () => {
    const polygon = renderPolygon();
    expect(polygon.getAttribute('points')).toBe('0,0 100,0 50,100');
  });

  it('data-shape-id 속성을 설정한다', () => {
    const polygon = renderPolygon();
    expect(polygon.getAttribute('data-shape-id')).toBe('poly-1');
  });

  it('호버되지 않았을 때 accentFill을 사용한다', () => {
    const polygon = renderPolygon();
    expect(polygon.getAttribute('fill')).toBe(COLORS.accentFill);
  });

  it('호버 시 accentFillHover를 사용한다', () => {
    const polygon = renderPolygon(true, false);
    expect(polygon.getAttribute('fill')).toBe(COLORS.accentFillHover);
  });

  it('기본 상태에서 strokeWidth가 2다', () => {
    const polygon = renderPolygon();
    expect(polygon.getAttribute('stroke-width')).toBe('2');
  });

  it('호버 또는 드래그 시 strokeWidth가 3이다', () => {
    const polygon = renderPolygon(true, false);
    expect(polygon.getAttribute('stroke-width')).toBe('3');
  });
});
