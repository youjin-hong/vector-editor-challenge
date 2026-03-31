import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/app/providers/editorStore';
import { PENDING_VERTEX_RADIUS, COLORS, TOOLBAR_WIDTH, STATUS_BAR_HEIGHT } from '@/shared/config/constants';
import { useCanvasInteraction } from '../lib/useCanvasInteraction';
import { GridPattern } from './GridPattern';
import { PointRenderer } from './PointRenderer';
import { PolygonRenderer } from './PolygonRenderer';

const CURSOR_MAP = {
  point: 'crosshair',
  polygon: 'crosshair',
  move: 'default',
  delete: 'default',
} as const;

export const Canvas = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const mode = useEditorStore((s) => s.mode);
  const shapes = useEditorStore((s) => s.shapes);
  const pendingVertices = useEditorStore((s) => s.pendingVertices);

  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const {
    hoveredShapeId,
    isDragging,
    dragShapeId,
    mousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useCanvasInteraction(dimensions.width, dimensions.height);

  const getCursor = (): string => {
    if (isDragging) return 'grabbing';
    if ((mode === 'move' || mode === 'delete') && hoveredShapeId) {
      return mode === 'move' ? 'grab' : 'pointer';
    }
    return CURSOR_MAP[mode];
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden"
      style={{
        marginLeft: TOOLBAR_WIDTH,
        marginBottom: STATUS_BAR_HEIGHT,
      }}
    >
      {dimensions.width > 0 && (
        <svg
          width={dimensions.width}
          height={dimensions.height}
          style={{ cursor: getCursor(), display: 'block' }}
          className="bg-editor-bg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <GridPattern width={dimensions.width} height={dimensions.height} />

          {/* Crosshair guides */}
          {mousePos && (mode === 'point' || mode === 'polygon') && (
            <g opacity={0.15}>
              <line
                x1={mousePos.x}
                y1={0}
                x2={mousePos.x}
                y2={dimensions.height}
                stroke={COLORS.accent}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <line
                x1={0}
                y1={mousePos.y}
                x2={dimensions.width}
                y2={mousePos.y}
                stroke={COLORS.accent}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          )}

          {/* Rendered shapes */}
          {shapes.map((shape) =>
            shape.type === 'point' ? (
              <PointRenderer
                key={shape.id}
                shape={shape}
                isHovered={hoveredShapeId === shape.id}
                isDragging={dragShapeId === shape.id}
              />
            ) : (
              <PolygonRenderer
                key={shape.id}
                shape={shape}
                isHovered={hoveredShapeId === shape.id}
                isDragging={dragShapeId === shape.id}
              />
            ),
          )}

          {/* Pending polygon preview */}
          {pendingVertices.length > 0 && (
            <g>
              {/* Lines between vertices */}
              {pendingVertices.length > 1 && (
                <polyline
                  points={pendingVertices.map((v) => `${v.x},${v.y}`).join(' ')}
                  fill="none"
                  stroke={COLORS.accent}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
              {/* Preview line to cursor */}
              {mousePos && (
                <line
                  x1={pendingVertices[pendingVertices.length - 1].x}
                  y1={pendingVertices[pendingVertices.length - 1].y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke={COLORS.accent}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              )}
              {/* Vertex dots */}
              {pendingVertices.map((v, i) => (
                <circle
                  key={i}
                  cx={v.x}
                  cy={v.y}
                  r={PENDING_VERTEX_RADIUS}
                  fill={COLORS.accent}
                />
              ))}
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
