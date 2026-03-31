import { test, expect } from '@playwright/test';
import { clickCanvas, dragCanvas, switchMode } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('드래그로 점을 이동한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  const circle = page.locator('circle[data-shape-id]');
  const cxBefore = await circle.getAttribute('cx');

  await switchMode(page, 'move');
  await dragCanvas(page, 200, 200, 300, 300);

  const cxAfter = await circle.getAttribute('cx');
  expect(cxAfter).not.toBe(cxBefore);
});

test('드래그로 다각형을 이동한다', async ({ page }) => {
  await switchMode(page, 'polygon');
  await clickCanvas(page, 100, 100);
  await clickCanvas(page, 200, 100);
  await clickCanvas(page, 150, 200);
  await page.keyboard.press('Enter');

  const polygon = page.locator('polygon[data-shape-id]');
  const pointsBefore = await polygon.getAttribute('points');

  await switchMode(page, 'move');
  await dragCanvas(page, 150, 140, 250, 240);

  const pointsAfter = await polygon.getAttribute('points');
  expect(pointsAfter).not.toBe(pointsBefore);
});

test('빈 영역을 드래그해도 아무 일 없다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  await switchMode(page, 'move');

  const circle = page.locator('circle[data-shape-id]');
  const cxBefore = await circle.getAttribute('cx');

  // 도형이 없는 먼 곳을 드래그
  await dragCanvas(page, 500, 500, 600, 600);

  const cxAfter = await circle.getAttribute('cx');
  expect(cxAfter).toBe(cxBefore);
});

test('Ctrl+Z로 이동을 undo한다', async ({ page }) => {
  await clickCanvas(page, 200, 200);
  const circle = page.locator('circle[data-shape-id]');
  const cxBefore = await circle.getAttribute('cx');

  await switchMode(page, 'move');
  await dragCanvas(page, 200, 200, 350, 350);
  const cxAfterMove = await circle.getAttribute('cx');
  expect(cxAfterMove).not.toBe(cxBefore);

  await page.keyboard.press('Control+z');
  const cxAfterUndo = await circle.getAttribute('cx');
  expect(cxAfterUndo).toBe(cxBefore);
});
