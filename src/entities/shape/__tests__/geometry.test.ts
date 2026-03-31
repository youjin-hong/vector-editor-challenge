import { describe, it, expect } from 'vitest';
import {
  distance,
  isPointInCircle,
  isPointInPolygon,
  calculatePolygonCenter,
  clampToCanvas,
  findShapeAtPoint,
} from '../lib/geometry';
import type { Shape } from '../model/types';

describe('distance', () => {
  it('같은 좌표를 넣으면 0을 반환한다', () => {
    expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });

  it('두 점 사이 거리를 올바르게 계산한다', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('isPointInCircle', () => {
  it('원 내부의 점이면 true를 반환한다', () => {
    expect(isPointInCircle({ x: 10, y: 10 }, { x: 10, y: 10 }, 5)).toBe(true);
  });

  it('원 경계 위의 점이면 true를 반환한다', () => {
    expect(isPointInCircle({ x: 15, y: 10 }, { x: 10, y: 10 }, 5)).toBe(true);
  });

  it('원 바깥의 점이면 false를 반환한다', () => {
    expect(isPointInCircle({ x: 20, y: 20 }, { x: 10, y: 10 }, 5)).toBe(false);
  });
});

describe('isPointInPolygon', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];

  it('다각형 내부 점이면 true를 반환한다', () => {
    expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
  });

  it('다각형 외부 점이면 false를 반환한다', () => {
    expect(isPointInPolygon({ x: 15, y: 15 }, square)).toBe(false);
  });

  it('삼각형에서도 정상 동작한다', () => {
    const triangle = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ];
    expect(isPointInPolygon({ x: 5, y: 3 }, triangle)).toBe(true);
    expect(isPointInPolygon({ x: 0, y: 10 }, triangle)).toBe(false);
  });
});

describe('calculatePolygonCenter', () => {
  it('정사각형의 중심점을 계산한다', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const center = calculatePolygonCenter(square);
    expect(center.x).toBe(5);
    expect(center.y).toBe(5);
  });

  it('삼각형의 중심점을 계산한다', () => {
    const triangle = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 3, y: 6 },
    ];
    const center = calculatePolygonCenter(triangle);
    expect(center.x).toBe(3);
    expect(center.y).toBe(2);
  });
});

describe('clampToCanvas', () => {
  it('범위 내 좌표는 변경하지 않는다', () => {
    const result = clampToCanvas({ x: 50, y: 50 }, 100, 100);
    expect(result).toEqual({ x: 50, y: 50 });
  });

  it('음수 좌표는 0으로 클램핑한다', () => {
    const result = clampToCanvas({ x: -10, y: -5 }, 100, 100);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('캔버스 크기를 초과하는 좌표를 클램핑한다', () => {
    const result = clampToCanvas({ x: 150, y: 200 }, 100, 100);
    expect(result).toEqual({ x: 100, y: 100 });
  });
});

describe('findShapeAtPoint', () => {
  const shapes: Shape[] = [
    { id: '1', type: 'point', position: { x: 50, y: 50 } },
    {
      id: '2',
      type: 'polygon',
      vertices: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 },
      ],
    },
  ];

  it('해당 위치의 점 도형을 찾는다', () => {
    const result = findShapeAtPoint({ x: 50, y: 50 }, shapes);
    expect(result?.id).toBe('1');
  });

  it('다각형 내부를 클릭하면 해당 도형을 찾는다', () => {
    const result = findShapeAtPoint({ x: 150, y: 150 }, shapes);
    expect(result?.id).toBe('2');
  });

  it('도형이 없는 위치면 null을 반환한다', () => {
    const result = findShapeAtPoint({ x: 300, y: 300 }, shapes);
    expect(result).toBeNull();
  });

  it('도형이 겹칠 때 가장 위에 있는 도형을 반환한다', () => {
    const overlapping: Shape[] = [
      { id: 'a', type: 'point', position: { x: 50, y: 50 } },
      { id: 'b', type: 'point', position: { x: 50, y: 50 } },
    ];
    const result = findShapeAtPoint({ x: 50, y: 50 }, overlapping);
    expect(result?.id).toBe('b');
  });
});
