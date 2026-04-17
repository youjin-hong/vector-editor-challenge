export type {
  Coordinate,
  PointShape,
  PolygonShape,
  Shape,
  EditorMode,
  ViewMode,
} from "./model/types";
export { findShapeAtPoint, clampToCanvas } from "./lib/geometry";
export {
  generateSphereCloud,
  generateTerrainCloud,
  generateBuildingCloud,
  generateColorArray,
} from "./lib/pointCloudGenerator";
