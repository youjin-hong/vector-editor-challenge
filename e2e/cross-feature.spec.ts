import { test, expect } from '@playwright/test';
import { clickCanvas, dragCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('점 생성 → 이동 → undo 2회 → 전부 되돌려진다', async ({ page }) => {
  // 점 생성
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);

  // 점 이동
  await switchMode(page, 'move');
  await dragCanvas(page, 200, 200, 350, 350);

  // 이동 undo
  await page.keyboard.press('Control+z');
  const circle = page.locator('circle[data-shape-id]');
  const cxAfterFirstUndo = await circle.getAttribute('cx');
  expect(Number(cxAfterFirstUndo)).toBeCloseTo(200, 0);

  // 생성 undo
  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);
});

test('다각형 생성 → 삭제 → undo → 다각형이 복원된다', async ({ page }) => {
  // 다각형 생성
  await switchMode(page, 'polygon');
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await clickCanvas(page, 150, 200);
  await page.keyboard.press('Enter');
  await expect(page.locator('polygon[data-shape-id]')).toHaveCount(1);

  // 다각형 삭제
  await switchMode(page, 'delete');
  await clickCanvas(page, 150, 140);
  await expect(page.locator('polygon[data-shape-id]')).toHaveCount(0);

  // 삭제 undo → 다각형 복원
  await page.keyboard.press('Control+z');
  await expect(page.locator('polygon[data-shape-id]')).toHaveCount(1);
});

test('여러 도형 생성 → 전체 undo → 전체 redo → 전부 복원된다', async ({ page }) => {
  // 점 3개 생성
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 200);
  await clickCanvas(page, 300, 300);
  await expect(page.locator('[data-shape-id]')).toHaveCount(3);

  // 전체 undo
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+z');
  await expect(page.locator('[data-shape-id]')).toHaveCount(0);

  // 전체 redo
  await page.keyboard.press('Control+Shift+Z');
  await page.keyboard.press('Control+Shift+Z');
  await page.keyboard.press('Control+Shift+Z');
  await expect(page.locator('[data-shape-id]')).toHaveCount(3);
});
