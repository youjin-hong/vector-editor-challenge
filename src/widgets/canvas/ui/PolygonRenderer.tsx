import type { PolygonShape } from '@/entities/shape';
import { COLORS } from '@/shared/config/constants';

interface PolygonRendererProps {
  shape: PolygonShape;
  isHovered: boolean;
  isDragging: boolean;
}

export const PolygonRenderer = ({
  shape,
  isHovered,
  isDragging,
}: PolygonRendererProps): JSX.Element => {
  const active = isHovered || isDragging;
  const points = shape.vertices.map((v) => `${v.x},${v.y}`).join(' ');

  return (
    <polygon
      points={points}
      fill={active ? COLORS.accentFillHover : COLORS.accentFill}
      stroke={active ? COLORS.accentHover : COLORS.accent}
      strokeWidth={active ? 3 : 2}
      data-shape-id={shape.id}
      className="transition-all duration-100"
    />
  );
};
