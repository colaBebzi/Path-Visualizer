import { test, expect } from "@playwright/test";

for (const width of [390, 1000, 1440]) {
  test(`endpoint icons leave no gaps between grid rows at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // Put endpoints on separate rows so both icon sizes are exercised.
    await page.getByRole("button", { name: /^End point/ }).click();
    await page.locator('[data-cell="510"]').click();
    const gaps = await page.locator(".board-row").evaluateAll((rows) =>
      rows.map((row) => {
        const cell = [...row.children].find(
          (cell) =>
            !cell.classList.contains("start") &&
            !cell.classList.contains("finish"),
        );
        return (
          row.getBoundingClientRect().height -
          cell.getBoundingClientRect().height
        );
      }),
    );
    // Allow subpixel rounding, but never an icon-sized gap.
    expect(Math.max(...gaps)).toBeLessThan(0.1);
  });
}
