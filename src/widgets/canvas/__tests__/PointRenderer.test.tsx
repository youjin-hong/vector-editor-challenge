import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PointRenderer } from '../ui/PointRenderer';
import { POINT_RADIUS, POINT_HOVER_RADIUS, COLORS } from '@/shared/config/constants';
import type { PointShape } from '@/entities/shape';

const shape: PointShape = {
  id: 'pt-1',
  type: 'point',
  position: { x: 100, y: 200 },
};

const renderPoint = (isHovered = false, isDragging = false) => {
  const { container } = render(
    <svg>
      <PointRenderer shape={shape} isHovered={isHovered} isDragging={isDragging} />
    </svg>,
  );
  return container.querySelector('circle')!;
};

describe('PointRenderer', () => {
  it('올바른 위치에 circle을 렌더링한다', () => {
    const circle = renderPoint();
    expect(circle.getAttribute('cx')).toBe('100');
    expect(circle.getAttribute('cy')).toBe('200');
  });

  it('data-shape-id 속성을 설정한다', () => {
    const circle = renderPoint();
    expect(circle.getAttribute('data-shape-id')).toBe('pt-1');
  });

  it('호버되지 않았을 때 POINT_RADIUS를 사용한다', () => {
    const circle = renderPoint();
    expect(circle.getAttribute('r')).toBe(String(POINT_RADIUS));
  });

  it('호버 시 POINT_HOVER_RADIUS를 사용한다', () => {
    const circle = renderPoint(true, false);
    expect(circle.getAttribute('r')).toBe(String(POINT_HOVER_RADIUS));
  });

  it('드래그 중 POINT_HOVER_RADIUS를 사용한다', () => {
    const circle = renderPoint(false, true);
    expect(circle.getAttribute('r')).toBe(String(POINT_HOVER_RADIUS));
  });

  it('호버 또는 드래그 시 stroke를 표시한다', () => {
    const circle = renderPoint(true, false);
    expect(circle.getAttribute('stroke')).toBe(COLORS.accentHover);
    expect(circle.getAttribute('stroke-width')).toBe('2');
  });

  it('기본 상태에서 stroke가 없다', () => {
    const circle = renderPoint();
    expect(circle.getAttribute('stroke')).toBe('none');
  });
});
