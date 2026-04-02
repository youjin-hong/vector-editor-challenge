import { type Page } from "@playwright/test";

// 툴바 너비 56px
const TOOLBAR_WIDTH = 56;

// 캔버스 원점 기준 좌표를 클릭한다. 툴바 오프셋을 자동 보정한다.
export const clickCanvas = async (
  page: Page,
  x: number,
  y: number,
): Promise<void> => {
  await page.mouse.click(TOOLBAR_WIDTH + x, y);
};

// 캔버스 위에서 드래그한다.
export const dragCanvas = async (
  page: Page,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): Promise<void> => {
  await page.mouse.move(TOOLBAR_WIDTH + fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(TOOLBAR_WIDTH + toX, toY, { steps: 5 });
  await page.mouse.up();
};

// 키보드 단축키로 에디터 모드를 전환한다.
export const switchMode = async (
  page: Page,
  mode: "point" | "polygon" | "move" | "delete",
): Promise<void> => {
  const keyMap = { point: "1", polygon: "2", move: "3", delete: "4" };
  await page.keyboard.press(keyMap[mode]);
};

// 캔버스에 렌더링된 도형 요소 수를 반환한다.
export const getShapeCount = async (page: Page): Promise<number> => {
  return page.locator("[data-shape-id]").count();
};

// 상태바의 모드 라벨 텍스트를 반환한다.
export const getModeLabel = async (page: Page): Promise<string | null> => {
  return page.locator(".bg-editor-accent\\/20").textContent();
};
