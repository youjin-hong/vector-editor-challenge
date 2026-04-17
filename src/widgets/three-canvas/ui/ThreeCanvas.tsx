import { type JSX } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEditorStore } from '@/app/providers/editorStore';
import { TOOLBAR_WIDTH, STATUS_BAR_HEIGHT } from '@/shared/config/constants';
import { GRID_SIZE, CAMERA_POSITION } from '@/shared/config/three-constants';
import { PointCloudRenderer } from './PointCloudRenderer';
import { Point3DRenderer } from './Point3DRenderer';
import { Polygon3DRenderer } from './Polygon3DRenderer';
import { GroundPlane } from './GroundPlane';

export const ThreeCanvas = (): JSX.Element => {
  const shapes = useEditorStore((s) => s.shapes);

  return (
    <div
      className="flex-1 overflow-hidden"
      style={{
        marginLeft: TOOLBAR_WIDTH,
        marginBottom: STATUS_BAR_HEIGHT,
      }}
    >
      <Canvas
        camera={{
          position: [CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: '#0A0A0B' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />

        <OrbitControls makeDefault />

        {/* 그리드 + 축 헬퍼 */}
        <gridHelper args={[GRID_SIZE, GRID_SIZE, '#2A2A2D', '#1C1C1E']} />
        <axesHelper args={[5]} />

        {/* 바닥 평면 (클릭 감지용) */}
        <GroundPlane />

        {/* Point Cloud */}
        <PointCloudRenderer />

        {/* 기존 shapes 3D 렌더링 */}
        {shapes.map((shape) =>
          shape.type === 'point' ? (
            <Point3DRenderer key={shape.id} shape={shape} />
          ) : (
            <Polygon3DRenderer key={shape.id} shape={shape} />
          ),
        )}
      </Canvas>
    </div>
  );
};
