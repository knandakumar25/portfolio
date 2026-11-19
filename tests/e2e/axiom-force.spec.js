import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`Axiom Force discovery and details at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/projects');
    await page.getByPlaceholder('Search projects...').fill('Axiom Force');
    const card = page.locator('.project-grid-card').filter({ hasText: 'Axiom Force' });
    await expect(card).toHaveCount(1);
    await page.getByPlaceholder('Search projects...').fill('');
    await page.locator('select').filter({ has: page.locator('option[value="Game"]') }).selectOption('Game');
    await page.locator('select').filter({ has: page.locator('option[value="Personal Projects"]') }).selectOption('Personal Projects');
    await expect(page.locator('.project-grid-card')).toHaveCount(1);
    await expect(card).toBeVisible();
    await expect(card.getByText('Personal Projects', { exact: true })).toBeVisible();
    const cardArt = card.getByRole('img', { name: 'Axiom Force', exact: true });
    await expect(cardArt).toBeVisible();
    await expect.poll(() => cardArt.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('card.png'), fullPage: true });
    await card.getByRole('button', { name: 'Launch Game' }).click();
    await expect(page).toHaveURL(/\/game\/axiom-force$/);
    await expect(page.getByRole('heading', { name: 'Axiom Force', exact: true })).toBeVisible();
    await expect(page.getByText('Duration: March 2025 – Present')).toBeVisible();
    const artwork = page.getByRole('img', { name: 'Axiom Force Title Card' });
    await expect(artwork).toBeVisible();
    await expect.poll(() => artwork.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    const description = page.locator('.card-text');
    for (const text of ['ongoing personal 2D action game', 'twelve-mission campaign', 'React.js player website', 'Node.js/PostgreSQL accounts backend', 'AI-assisted development']) {
      await expect(description).toContainText(text);
    }
    for (const skill of ['Godot', 'C#', 'Game Development', 'React.js', 'Node.js', 'PostgreSQL', 'Docker', 'Game Testing']) {
      await expect(page.locator('.badge').getByText(skill, { exact: true })).toBeVisible();
    }
    const source = page.getByRole('link', { name: 'Source Code', exact: true });
    await expect(source).toHaveAttribute('href', 'https://github.com/knandakumar25/frog_jumper');
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(source.locator('.bi-github')).toHaveAttribute('aria-hidden', 'true');
    await source.focus();
    await expect(source).toBeFocused();
    await expect(page.getByRole('button', { name: 'Play Game', exact: true })).toHaveCount(0);
    await expect(page.locator('a[download], iframe')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath('details.png'), fullPage: true });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Axiom Force', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
