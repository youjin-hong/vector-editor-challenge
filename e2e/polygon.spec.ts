import { test, expect } from '@playwright/test';
import { clickCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await switchMode(page, 'polygon');
});

test('3번 클릭 + Enter로 다각형을 생성한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await clickCanvas(page, 150, 200);
  await page.keyboard.press('Enter');
  const polygons = page.locator('polygon[data-shape-id]');
  await expect(polygons).toHaveCount(1);
});

test('클릭하는 동안 미완성 꼭짓점 프리뷰를 표시한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  const polyline = page.locator('polyline');
  await expect(polyline).toHaveCount(1);
});

test('꼭짓점 3개 미만에서 Enter를 누르면 생성을 거부한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await page.keyboard.press('Enter');
  const polygons = page.locator('polygon[data-shape-id]');
  await expect(polygons).toHaveCount(0);
});

test('모드 전환 시 미완성 꼭짓점을 폐기한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await switchMode(page, 'point');
  // 다시 polygon 모드로 돌아와도 미완성 꼭짓점은 사라져야 한다
  await switchMode(page, 'polygon');
  const polyline = page.locator('polyline');
  await expect(polyline).toHaveCount(0);
});

test('Escape를 누르면 미완성 꼭짓점을 폐기한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await page.keyboard.press('Escape');
  const polyline = page.locator('polyline');
  await expect(polyline).toHaveCount(0);
});
