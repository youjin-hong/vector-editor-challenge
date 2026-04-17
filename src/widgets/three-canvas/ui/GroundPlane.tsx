import { useCallback, type JSX } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useEditorStore } from '@/app/providers/editorStore';
import { CreatePointCommand } from '@/features/create-shape';
import { generateId } from '@/shared/lib/generateId';
import { GROUND_PLANE_SIZE } from '@/shared/config/three-constants';
import type { PointShape } from '@/entities/shape';

/**
 * 투명한 바닥 평면 (y=0) — point 모드에서 클릭하여 포인트 생성
 */
export const GroundPlane = (): JSX.Element => {
  const mode = useEditorStore((s) => s.mode);
  const addShape = useEditorStore((s) => s.addShape);
  const removeShape = useEditorStore((s) => s.removeShape);
  const executeCommand = useEditorStore((s) => s.executeCommand);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>): void => {
      if (mode !== 'point') return;
      e.stopPropagation();

      const { x, z } = e.point;
      const point: PointShape = {
        id: generateId(),
        type: 'point',
        position: { x, y: z },
      };
      const command = new CreatePointCommand(point, addShape, removeShape);
      executeCommand(command);
    },
    [mode, addShape, removeShape, executeCommand],
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.001, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[GROUND_PLANE_SIZE, GROUND_PLANE_SIZE]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
};
