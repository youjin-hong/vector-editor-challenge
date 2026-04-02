import { test, expect } from '@playwright/test';
import { clickCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('1/2/3/4 키로 모드를 전환한다', async ({ page }) => {
  const modeLabel = page.locator('.bg-editor-accent\\/20');

  await page.keyboard.press('2');
  await expect(modeLabel).toHaveText(/Polygon/);

  await page.keyboard.press('3');
  await expect(modeLabel).toHaveText(/Move/);

  await page.keyboard.press('4');
  await expect(modeLabel).toHaveText(/Delete/);

  await page.keyboard.press('1');
  await expect(modeLabel).toHaveText(/Point/);
});

test('Enter로 다각형 생성을 완료한다', async ({ page }) => {
  await switchMode(page, 'polygon');
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await clickCanvas(page, 150, 200);
  await page.keyboard.press('Enter');
  await expect(page.locator('polygon[data-shape-id]')).toHaveCount(1);
});

test('Escape로 현재 작업을 취소한다', async ({ page }) => {
  await switchMode(page, 'polygon');
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);

  // 미완성 꼭짓점이 있는지 확인
  await expect(page.locator('polyline')).toHaveCount(1);

  await page.keyboard.press('Escape');

  // 미완성 꼭짓점이 사라져야 한다
  await expect(page.locator('polyline')).toHaveCount(0);
});
