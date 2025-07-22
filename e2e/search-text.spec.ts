import { test, expect } from "@playwright/test";

test("Search Playwright Text", async ({ page }) => {
  await page.goto("http://localhost:3000");

  expect(page.getByText(/Welcome to Playwright Testing with Nextjs/));
});
