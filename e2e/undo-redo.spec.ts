import { test, expect } from '@playwright/test';
import { clickCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('히스토리가 비어있으면 undo/redo 버튼이 비활성화된다', async ({ page }) => {
  const undoButton = page.locator('button:has-text("Undo")').first();
  const redoButton = page.locator('button:has-text("Redo")').first();
  await expect(undoButton).toBeDisabled();
  await expect(redoButton).toBeDisabled();
});

test('툴바 버튼으로 undo/redo한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);

  const undoButton = page.locator('button:has-text("Undo")').first();
  const redoButton = page.locator('button:has-text("Redo")').first();

  await undoButton.click();
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);

  await redoButton.click();
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);
});

test('새 액션 수행 시 redo 스택을 비운다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await page.keyboard.press('Control+z');

  const redoButton = page.locator('button:has-text("Redo")').first();
  await expect(redoButton).not.toBeDisabled();

  // 새 액션 수행 → redo 불가
  await clickCanvas(page, 300, 300);
  await expect(redoButton).toBeDisabled();
});

test('연속 undo/redo를 처리한다', async ({ page }) => {
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 200);
  await clickCanvas(page, 300, 300);
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(3);

  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(2);

  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);

  await page.keyboard.press('Control+z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(0);

  await page.keyboard.press('Control+Shift+Z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(1);

  await page.keyboard.press('Control+Shift+Z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(2);

  await page.keyboard.press('Control+Shift+Z');
  await expect(page.locator('circle[data-shape-id]')).toHaveCount(3);
});
