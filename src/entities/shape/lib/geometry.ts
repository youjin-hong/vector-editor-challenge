import type { Coordinate, Shape } from '../model/types';
import { HIT_RADIUS, POINT_RADIUS } from '@/shared/config/constants';

export const distance = (a: Coordinate, b: Coordinate): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isPointInCircle = (
  point: Coordinate,
  center: Coordinate,
  radius: number,
): boolean => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return dx * dx + dy * dy <= radius * radius;
};

export const isPointInPolygon = (point: Coordinate, vertices: Coordinate[]): boolean => {
  let inside = false;
  const n = vertices.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

export const isPointOnPolygonEdge = (
  point: Coordinate,
  vertices: Coordinate[],
  threshold: number = HIT_RADIUS,
): boolean => {
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    const dist = distanceToSegment(point, a, b);
    if (dist <= threshold) return true;
  }
  return false;
};

const distanceToSegment = (p: Coordinate, a: Coordinate, b: Coordinate): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return distance(p, a);

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
};

export const calculatePolygonCenter = (vertices: Coordinate[]): Coordinate => {
  const sum = vertices.reduce(
    (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
    { x: 0, y: 0 },
  );
  return {
    x: sum.x / vertices.length,
    y: sum.y / vertices.length,
  };
};

export const findShapeAtPoint = (
  point: Coordinate,
  shapes: Shape[],
): Shape | null => {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (shape.type === 'point') {
      if (isPointInCircle(point, shape.position, Math.max(POINT_RADIUS, HIT_RADIUS))) {
        return shape;
      }
    } else if (shape.type === 'polygon') {
      if (
        isPointInPolygon(point, shape.vertices) ||
        isPointOnPolygonEdge(point, shape.vertices)
      ) {
        return shape;
      }
    }
  }
  return null;
};

export const clampToCanvas = (
  coord: Coordinate,
  width: number,
  height: number,
): Coordinate => {
  return {
    x: Math.max(0, Math.min(coord.x, width)),
    y: Math.max(0, Math.min(coord.y, height)),
  };
};
