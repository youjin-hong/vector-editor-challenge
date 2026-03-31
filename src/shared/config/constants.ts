export const POINT_RADIUS = 6;
export const POINT_HOVER_RADIUS = 8;
export const PENDING_VERTEX_RADIUS = 4;
export const HIT_RADIUS = 12;

export const GRID_SPACING = 24;
export const GRID_DOT_RADIUS = 1;

export const MIN_POLYGON_VERTICES = 3;

export const TOOLBAR_WIDTH = 56;
export const STATUS_BAR_HEIGHT = 36;

export const FEEDBACK_MESSAGE_TIMEOUT = 1500;

export const MODE_LABELS: Record<string, string> = {
  point: 'Point',
  polygon: 'Polygon',
  move: 'Move',
  delete: 'Delete',
};

export const COLORS = {
  accent: '#F97316',
  accentHover: '#FB923C',
  accentFill: 'rgba(249, 115, 22, 0.15)',
  accentFillHover: 'rgba(249, 115, 22, 0.25)',
  gridDot: '#2A2A2D',
} as const;
