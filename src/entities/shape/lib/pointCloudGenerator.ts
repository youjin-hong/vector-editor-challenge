import { POINT_CLOUD_DEFAULT_COLOR } from '@/shared/config/three-constants';

/**
 * 구 표면에 균일 분포하는 포인트 클라우드 생성
 * Marsaglia (1972) 방법으로 구면 균일 분포 보장
 */
export const generateSphereCloud = (count: number, radius: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const idx = i * 3;

    positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
    positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[idx + 2] = radius * Math.cos(phi);
  }

  return positions;
};

/**
 * xz 평면 격자 + sin/cos 조합 지형 높이맵 포인트 클라우드
 */
export const generateTerrainCloud = (
  width: number,
  depth: number,
  resolution: number,
): Float32Array => {
  const countX = Math.ceil(width * resolution);
  const countZ = Math.ceil(depth * resolution);
  const positions = new Float32Array(countX * countZ * 3);
  const stepX = width / (countX - 1 || 1);
  const stepZ = depth / (countZ - 1 || 1);

  let idx = 0;
  for (let iz = 0; iz < countZ; iz++) {
    for (let ix = 0; ix < countX; ix++) {
      const x = ix * stepX - width / 2;
      const z = iz * stepZ - depth / 2;

      // sin/cos 조합으로 자연스러운 지형 생성
      const y =
        Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 +
        Math.sin(x * 0.7 + z * 0.5) * 0.8 +
        Math.cos(z * 0.2) * Math.sin(x * 0.1 + 1.5) * 1.5;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      idx += 3;
    }
  }

  return positions;
};

/**
 * 도시 건물을 모사하는 박스 형태 포인트 클라우드 생성
 * 격자 위치에 랜덤 높이 건물을 배치하고 표면에 포인트를 분포
 */
export const generateBuildingCloud = (count: number): Float32Array => {
  const buildingCount = Math.max(1, Math.floor(count / 200));
  const pointsPerBuilding = Math.floor(count / buildingCount);
  const positions = new Float32Array(buildingCount * pointsPerBuilding * 3);

  const gridSize = Math.ceil(Math.sqrt(buildingCount));
  const spacing = 4;

  let idx = 0;
  for (let b = 0; b < buildingCount; b++) {
    const gridX = (b % gridSize) * spacing - (gridSize * spacing) / 2;
    const gridZ = Math.floor(b / gridSize) * spacing - (gridSize * spacing) / 2;

    const bWidth = 1 + Math.random() * 2;
    const bDepth = 1 + Math.random() * 2;
    const bHeight = 2 + Math.random() * 8;

    for (let p = 0; p < pointsPerBuilding; p++) {
      const face = Math.floor(Math.random() * 6);
      let x: number, y: number, z: number;

      switch (face) {
        case 0: // front
          x = gridX + (Math.random() - 0.5) * bWidth;
          y = Math.random() * bHeight;
          z = gridZ + bDepth / 2;
          break;
        case 1: // back
          x = gridX + (Math.random() - 0.5) * bWidth;
          y = Math.random() * bHeight;
          z = gridZ - bDepth / 2;
          break;
        case 2: // left
          x = gridX - bWidth / 2;
          y = Math.random() * bHeight;
          z = gridZ + (Math.random() - 0.5) * bDepth;
          break;
        case 3: // right
          x = gridX + bWidth / 2;
          y = Math.random() * bHeight;
          z = gridZ + (Math.random() - 0.5) * bDepth;
          break;
        case 4: // top
          x = gridX + (Math.random() - 0.5) * bWidth;
          y = bHeight;
          z = gridZ + (Math.random() - 0.5) * bDepth;
          break;
        default: // bottom
          x = gridX + (Math.random() - 0.5) * bWidth;
          y = 0;
          z = gridZ + (Math.random() - 0.5) * bDepth;
          break;
      }

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      idx += 3;
    }
  }

  return positions.slice(0, idx);
};

type ColorMode = 'height' | 'distance' | 'uniform';

/**
 * positions 기반 색상 배열 생성 (RGB, 0-1 범위)
 */
export const generateColorArray = (
  positions: Float32Array,
  mode: ColorMode,
): Float32Array => {
  const pointCount = positions.length / 3;
  const colors = new Float32Array(pointCount * 3);

  if (mode === 'uniform') {
    const r = parseInt(POINT_CLOUD_DEFAULT_COLOR.slice(1, 3), 16) / 255;
    const g = parseInt(POINT_CLOUD_DEFAULT_COLOR.slice(3, 5), 16) / 255;
    const b = parseInt(POINT_CLOUD_DEFAULT_COLOR.slice(5, 7), 16) / 255;

    for (let i = 0; i < pointCount; i++) {
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    return colors;
  }

  // height/distance 모드용 min-max 계산
  let minVal = Infinity;
  let maxVal = -Infinity;

  for (let i = 0; i < pointCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const val = mode === 'height' ? y : Math.sqrt(x * x + y * y + z * z);
    if (val < minVal) minVal = val;
    if (val > maxVal) maxVal = val;
  }

  const range = maxVal - minVal || 1;

  for (let i = 0; i < pointCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const val = mode === 'height' ? y : Math.sqrt(x * x + y * y + z * z);
    const t = (val - minVal) / range;

    // 저온(파랑) → 고온(빨강) 그라데이션
    colors[i * 3] = t;
    colors[i * 3 + 1] = 0.2 + (1 - Math.abs(t - 0.5) * 2) * 0.8;
    colors[i * 3 + 2] = 1 - t;
  }

  return colors;
};
