import { test, expect } from '@playwright/test';

test('drag endpoints, handle unreachable routes, and cancel an active search', async ({ page }) => {
  await page.goto('/');
  const source = await page.locator('[data-cell="398"]').boundingBox();
  const target = await page.locator('[data-cell="400"]').boundingBox();
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 3 });
  await page.mouse.up();
  await expect(page.locator('[data-cell="400"]')).toHaveClass(/start/);
  for (const cell of [399, 401, 361, 439]) await page.locator(`[data-cell="${cell}"]`).click();
  await page.getByRole('button', { name: /Visualize path/ }).click();
  await expect(page.getByText('No path found', { exact: true })).toBeVisible();
  await expect(page.locator('.cell.path')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset grid' }).click();
  await page.getByRole('button', { name: /Visualize path/ }).click();
  await page.getByRole('button', { name: 'Reset grid' }).click();
  await expect(page.getByText('Ready to explore')).toBeVisible();
  await expect(page.locator('.cell.visited')).toHaveCount(0);
});

test('guide traps focus and returns it to its trigger', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'How it works' });
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Close guide' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: /Let’s find a path/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close guide' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('draw, erase, move endpoints, generate and reset', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Every path starts/ })).toBeVisible();
  await page.locator('[data-cell="80"]').click();
  await expect(page.locator('[data-cell="80"]')).toHaveClass(/wall/);
  await page.getByRole('button', { name: 'Erase E', exact: true }).click();
  await page.locator('[data-cell="80"]').click();
  await expect(page.locator('[data-cell="80"]')).not.toHaveClass(/wall/);
  await page.getByRole('button', { name: 'Start point S' }).click();
  await page.locator('[data-cell="81"]').click();
  await expect(page.locator('[data-cell="81"]')).toHaveClass(/start/);
  await page.getByRole('button', { name: 'Generate maze', exact: true }).click();
  expect(await page.locator('.cell.wall').count()).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'Reset grid' }).click();
  await expect(page.locator('.cell.wall')).toHaveCount(0);
  await expect(page.locator('[data-cell="398"]')).toHaveClass(/start/);
});

test('search can pause, step, resume, finish and clear', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: /Visualize path/ }).click();
  await page.getByRole('button', { name: 'Pause exploration' }).click();
  await expect(page.getByText('Exploration paused')).toBeVisible();
  const before = await page.locator('.cell.visited').count();
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  expect(await page.locator('.cell.visited').count()).toBe(before + 1);
  await page.locator('#speed').fill('100');
  await page.getByRole('button', { name: 'Resume exploration' }).click();
  await expect(page.getByText('Path found', { exact: true })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.locator('.cell.path')).toHaveCount(23);
  await expect(page.locator('.progress-track > div')).toHaveAttribute('style', /100%/);
  await page.getByRole('button', { name: 'Clear path' }).click();
  await expect(page.locator('.cell.visited')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('responsive layout and keyboard editing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.locator('[data-cell="398"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-cell="399"]')).toHaveClass(/wall/);
  await page.getByRole('button', { name: 'How it works' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
