import { test, expect } from '@playwright/test';
import { clickCanvas, switchMode, getShapeCount } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('point 모드에서 캔버스 클릭 시 점을 생성한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  const circles = page.locator('circle[data-shape-id]');
  await expect(circles).toHaveCount(1);
});

test('연속 클릭으로 여러 점을 생성한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 200);
  await clickCanvas(page, 300, 300);
  const circles = page.locator('circle[data-shape-id]');
  await expect(circles).toHaveCount(3);
});

test('Ctrl+Z로 점 생성을 undo한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);
  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);
});

test('Ctrl+Shift+Z로 점 생성을 redo한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);
  await page.keyboard.press('Control+Shift+Z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);
});
