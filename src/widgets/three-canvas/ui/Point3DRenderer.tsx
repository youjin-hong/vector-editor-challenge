import { useState, type JSX } from 'react';
import { Sphere } from '@react-three/drei';
import type { PointShape } from '@/entities/shape';
import { COLORS } from '@/shared/config/constants';
import { useShapeClickHandler } from '../lib/useThreeInteraction';

const POINT_3D_RADIUS = 0.3;
const POINT_3D_HOVER_RADIUS = 0.4;

interface Point3DRendererProps {
  shape: PointShape;
}

export const Point3DRenderer = ({ shape }: Point3DRendererProps): JSX.Element => {
  const [hovered, setHovered] = useState(false);
  const { handleClick } = useShapeClickHandler(shape.id);

  // shape.position (2D x,y) → 3D (x, 0, z) 매핑
  const x = shape.position.x;
  const z = shape.position.y;
  const y = 0;

  return (
    <Sphere
      args={[hovered ? POINT_3D_HOVER_RADIUS : POINT_3D_RADIUS, 16, 16]}
      position={[x, y, z]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? COLORS.accentHover : COLORS.accent}
      />
    </Sphere>
  );
};
