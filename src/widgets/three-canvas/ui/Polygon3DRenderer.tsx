import { useMemo, useState, type JSX } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import type { PolygonShape } from '@/entities/shape';
import { COLORS } from '@/shared/config/constants';
import { useShapeClickHandler } from '../lib/useThreeInteraction';

interface Polygon3DRendererProps {
  shape: PolygonShape;
}

export const Polygon3DRenderer = ({ shape }: Polygon3DRendererProps): JSX.Element => {
  const [hovered, setHovered] = useState(false);
  const { handleClick } = useShapeClickHandler(shape.id);

  // vertices (2D x,y) → 3D (x, 0, z) + 닫힌 루프
  const linePoints = useMemo((): [number, number, number][] => {
    const pts = shape.vertices.map(
      (v): [number, number, number] => [v.x, 0, v.y],
    );
    if (pts.length > 0) {
      pts.push(pts[0]); // 닫힌 다각형
    }
    return pts;
  }, [shape.vertices]);

  // 채우기용 ShapeGeometry (xz 평면에 flat)
  const fillGeometry = useMemo((): THREE.ShapeGeometry | null => {
    if (shape.vertices.length < 3) return null;

    const threeShape = new THREE.Shape();
    threeShape.moveTo(shape.vertices[0].x, shape.vertices[0].y);
    for (let i = 1; i < shape.vertices.length; i++) {
      threeShape.lineTo(shape.vertices[i].x, shape.vertices[i].y);
    }
    threeShape.closePath();

    return new THREE.ShapeGeometry(threeShape);
  }, [shape.vertices]);

  return (
    <group
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 채우기 면 — xz 평면에 배치 (x축 기준 -90도 회전) */}
      {fillGeometry && (
        <mesh
          geometry={fillGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.001, 0]}
        >
          <meshStandardMaterial
            color={COLORS.accent}
            opacity={hovered ? 0.25 : 0.15}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 외곽선 */}
      <Line
        points={linePoints}
        color={hovered ? COLORS.accentHover : COLORS.accent}
        lineWidth={hovered ? 3 : 2}
      />
    </group>
  );
};
