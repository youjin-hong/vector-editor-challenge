import { test, expect } from '@playwright/test';
import { clickCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('delete 모드에서 클릭으로 도형을 삭제한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);

  await switchMode(page, 'delete');
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);
});

test('빈 영역을 클릭해도 아무 일 없다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await switchMode(page, 'delete');

  // 도형이 없는 먼 곳을 클릭
  await clickCanvas(page, 500, 500);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);
});

test('Ctrl+Z로 삭제를 undo한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await switchMode(page, 'delete');
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);

  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);
});
