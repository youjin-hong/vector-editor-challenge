export type { Coordinate, PointShape, PolygonShape, Shape, EditorMode } from './model/types';
export { EDITOR_MODES } from './model/types';
export {
  distance,
  isPointInCircle,
  isPointInPolygon,
  isPointOnPolygonEdge,
  calculatePolygonCenter,
  findShapeAtPoint,
  clampToCanvas,
} from './lib/geometry';
