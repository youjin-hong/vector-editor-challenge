export interface Coordinate {
  x: number;
  y: number;
}

export interface PointShape {
  id: string;
  type: 'point';
  position: Coordinate;
}

export interface PolygonShape {
  id: string;
  type: 'polygon';
  vertices: Coordinate[];
}

export type Shape = PointShape | PolygonShape;

export const EDITOR_MODES = ['point', 'polygon', 'move', 'delete'] as const;
export type EditorMode = (typeof EDITOR_MODES)[number];

export type ViewMode = '2d' | '3d';
