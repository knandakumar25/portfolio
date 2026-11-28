import { test, expect } from '@playwright/test';

const organizationsByTab = {
  'Work Experience': [
    ['LlamaPress AI', 'llamapress.png'],
    ['SunTec Business Solutions', 'suntec.png'],
    ['Bucks County Board of Elections', 'bucks-county-board-of-elections.png'],
    ['Kumon Education Center', 'kumon.png'],
  ],
  Education: [
    ['Ira A. Fulton Schools of Engineering at Arizona State University', 'asu.png'],
    ['North Carolina State University', 'nc-state.png'],
    ['Neshaminy High School', 'neshaminy.png'],
  ],
  'Job Simulations': [
    ['Citi', 'citi.png'],
    ['Wells Fargo', 'wells-fargo.png'],
    ['Tata Consultancy Services', 'tcs.png'],
    ['Hewlett Packard Enterprise', 'hpe.png'],
    ['Skyscanner', 'skyscanner.png'],
    ['Quantium', 'quantium.png'],
    ['Datacom', 'datacom.png'],
    ['Lloyds Banking Group', 'lloyds-banking-group.png'],
    ['EY', 'ey.png'],
    ['Deloitte Australia', 'deloitte.png'],
    ['Commonwealth Bank', 'commbank.png'],
    ['Blackbird Australia', 'blackbird.png'],
    ['British Airways', 'british-airways.png'],
    ['Tata Group', 'tata-group.png'],
    ['Electronic Arts', 'ea.png'],
    ['JPMorgan Chase', 'jpmorgan-chase.png'],
    ['Walmart Global Tech', 'walmart-global-tech.png'],
  ],
  Volunteering: [
    ['Emergency Relief Association of Lower Bucks County', 'era-food-pantry.png'],
    ['United Way of Bucks County', 'united-way-of-bucks-county.png'],
  ],
  Organizations: [
    ['National Honor Society', 'national-honor-society.png'],
    ['Future Business Leaders of America', 'fbla.png'],
  ],
};

const cardFor = (page, name) => page.locator('.timeline-card').filter({
  has: page.getByRole('heading', { name, exact: true }),
});

async function expectLogo(card, filename) {
  const logo = card.locator('.experience-logo img');
  await expect(logo).toHaveAttribute('src', `/logos/${filename}`);
  await expect(logo).toHaveAttribute('alt', '');
  await expect(logo).toBeInViewport({ ratio: 0.99 });
  await expect(logo).toHaveCSS('object-fit', 'contain');
  await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await expect.poll(() => logo.evaluate(img => {
    const image = img.getBoundingClientRect();
    const tile = img.parentElement.getBoundingClientRect();
    const header = img.parentElement.parentElement.getBoundingClientRect();
    return [tile, header].every(bounds => image.left >= bounds.left && image.right <= bounds.right
      && image.top >= bounds.top && image.bottom <= bounds.bottom);
  })).toBeTruthy();
  await expect.poll(() => card.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
}

for (const width of [1440, 390]) {
  for (const [tab, organizations] of Object.entries(organizationsByTab)) {
    test(`${tab} logos in the timeline and details at ${width}px`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await page.goto('/experiences');
      await page.getByRole('button', { name: tab, exact: true }).click();
      const dialog = page.locator('.exp-modal');

      for (const [name, filename] of organizations) {
        const card = cardFor(page, name);
        await card.scrollIntoViewIfNeeded();
        await expectLogo(card, filename);
        await card.getByRole('button', { name: 'View Details', exact: true }).click();
        await expect(dialog.getByRole('heading', { name, exact: true })).toBeVisible();
        await expectLogo(dialog, filename);
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
        await dialog.getByRole('button', { name: 'Close details' }).click();
        await expect(dialog).toBeHidden();
      }
    });
  }
}

test('experience icons appear when a logo is missing or fails to load', async ({ page }) => {
  await page.route('**/logos/citi.png', route => route.abort());
  await page.goto('/experiences');
  const dialog = page.locator('.exp-modal');

  await page.getByRole('button', { name: 'Job Simulations', exact: true }).click();
  const citi = cardFor(page, 'Citi');
  await expect(citi.locator('.timeline-card-icon-wrap .bi-laptop-fill')).toBeVisible();
  await citi.getByRole('button', { name: 'View Details' }).click();
  await expect(dialog.locator('.work-icon .bi-building')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close details' }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: 'Organizations', exact: true }).click();
  const club = cardFor(page, 'App Development Club');
  await expect(club.locator('.timeline-card-icon-wrap .bi-diagram-3-fill')).toBeVisible();
  await club.getByRole('button', { name: 'View Details' }).click();
  await expect(dialog.locator('.organization-icon .bi-diagram-3-fill')).toBeVisible();
});
