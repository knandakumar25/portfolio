import { test, expect } from '@playwright/test';

const originalTitle = 'Axiom Force';
const racingTitle = 'Axiom Force: Drift Circuit';
const racingArtwork = 'A teal race car rounding an elevated curve at Skyport Terminal';

function projectCard(page, title) {
  return page.locator('.project-grid-card').filter({ has: page.getByText(title, { exact: true }) });
}

async function expectLoadedArtwork(image) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`Axiom Force discovery and details at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/projects');
    await page.getByPlaceholder('Search projects...').fill('Axiom Force');
    const card = projectCard(page, originalTitle);
    const racingCard = projectCard(page, racingTitle);
    await expect(card).toHaveCount(1);
    await expect(racingCard).toHaveCount(1);
    await page.getByPlaceholder('Search projects...').fill('');
    await page.locator('select').filter({ has: page.locator('option[value="Game"]') }).selectOption('Game');
    await page.locator('select').filter({ has: page.locator('option[value="Personal Projects"]') }).selectOption('Personal Projects');
    await expect(page.locator('.project-grid-card')).toHaveCount(2);
    for (const project of [card, racingCard]) {
      await expect(project).toBeVisible();
      await expect(project.getByText('Personal Projects', { exact: true })).toBeVisible();
    }
    const cardArt = card.getByRole('img', { name: 'Axiom Force', exact: true });
    await expectLoadedArtwork(cardArt);
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('card.png'), fullPage: true });
    await card.getByRole('button', { name: 'Launch Game' }).click();
    await expect(page).toHaveURL(/\/game\/axiom-force$/);
    await expect(page.getByRole('heading', { name: 'Axiom Force', exact: true })).toBeVisible();
    await expect(page.getByText('Duration: March 2025 – Present')).toBeVisible();
    const artwork = page.getByRole('img', { name: 'Axiom Force Title Card' });
    await expectLoadedArtwork(artwork);
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

  test(`Drift Circuit search and details at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/projects');
    await page.getByPlaceholder('Search projects...').fill('Drift Circuit');
    const card = projectCard(page, racingTitle);
    await expect(page.locator('.project-grid-card')).toHaveCount(1);
    await expectLoadedArtwork(card.getByRole('img', { name: racingArtwork, exact: true }));
    await card.getByRole('button', { name: 'View Details', exact: true }).click();

    await expect(page).toHaveURL(/\/game\/axiom-force-drift-circuit$/);
    const heading = page.getByRole('heading', { name: racingTitle, exact: true });
    const artwork = page.getByRole('img', { name: racingArtwork, exact: true });
    await expect(heading).toBeVisible();
    await expectLoadedArtwork(artwork);
    await expect(page.getByText('Duration: November 2026 – Present')).toBeVisible();
    for (const skill of ['Unity', 'C#', 'Game Development', 'Node.js', 'PostgreSQL', 'WebSockets']) {
      await expect(page.locator('.badge').getByText(skill, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'Source Code', exact: true })).toHaveAttribute(
      'href', 'https://github.com/knandakumar25/axiom_force_racing'
    );

    expect((await page.reload())?.ok()).toBeTruthy();
    await expect(heading).toBeVisible();
    await expectLoadedArtwork(artwork);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });
}
