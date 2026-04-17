import { useRef, useMemo, type JSX } from 'react';
import * as THREE from 'three';
import { useEditorStore } from '@/app/providers/editorStore';
import { generateTerrainCloud, generateColorArray } from '@/entities/shape';

const TERRAIN_WIDTH = 30;
const TERRAIN_DEPTH = 30;
const TERRAIN_RESOLUTION = 3;

export const PointCloudRenderer = (): JSX.Element | null => {
  const pointsRef = useRef<THREE.Points>(null);
  const pointCloudVisible = useEditorStore((s) => s.pointCloudVisible);
  const pointSize = useEditorStore((s) => s.pointSize);

  const { positions, colors } = useMemo(() => {
    const pos = generateTerrainCloud(TERRAIN_WIDTH, TERRAIN_DEPTH, TERRAIN_RESOLUTION);
    const col = generateColorArray(pos, 'height');
    return { positions: pos, colors: col };
  }, []);

  if (!pointCloudVisible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
};
