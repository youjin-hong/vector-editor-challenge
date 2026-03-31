import type { PointShape } from '@/entities/shape';
import { POINT_RADIUS, POINT_HOVER_RADIUS, COLORS } from '@/shared/config/constants';

interface PointRendererProps {
  shape: PointShape;
  isHovered: boolean;
  isDragging: boolean;
}

export const PointRenderer = ({
  shape,
  isHovered,
  isDragging,
}: PointRendererProps): JSX.Element => {
  const active = isHovered || isDragging;

  return (
    <circle
      cx={shape.position.x}
      cy={shape.position.y}
      r={active ? POINT_HOVER_RADIUS : POINT_RADIUS}
      fill={COLORS.accent}
      stroke={active ? COLORS.accentHover : 'none'}
      strokeWidth={active ? 2 : 0}
      data-shape-id={shape.id}
      className="transition-all duration-100"
    />
  );
};
