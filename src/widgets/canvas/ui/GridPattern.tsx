import { GRID_SPACING, GRID_DOT_RADIUS, COLORS } from '@/shared/config/constants';

interface GridPatternProps {
  width: number;
  height: number;
}

export const GridPattern = ({ width, height }: GridPatternProps): JSX.Element => {
  return (
    <>
      <defs>
        <pattern
          id="grid-dots"
          width={GRID_SPACING}
          height={GRID_SPACING}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={GRID_SPACING} cy={GRID_SPACING} r={GRID_DOT_RADIUS} fill={COLORS.gridDot} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#grid-dots)" />
    </>
  );
};
