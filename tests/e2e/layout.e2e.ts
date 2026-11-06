import { expect, test } from '@playwright/test';
import { oldHostsRequested, sidewaysOverflow } from './helpers';

// Every page shows the header, nav and footer from src/routes/+layout.svelte (GGW-1).

const PAGES = [
	{ path: '/', name: 'Home' },
	{ path: '/about', name: 'About' },
	{ path: '/shop', name: 'Shop' },
	{ path: '/wholesale', name: 'Wholesale' },
	{ path: '/contact', name: 'Contact' }
];

for (const width of [375, 768, 1280]) {
	test.describe(`at ${width}px wide`, () => {
		test.use({ viewport: { width, height: 800 } });

		for (const { path, name } of PAGES) {
			test(`${path} shows the header, logo, nav, footer and its heading`, async ({ page }) => {
				await page.goto(path);
				const header = page.getByRole('banner');
				const logo = header.getByRole('link', { name: 'Guzzling Goat Coffee' }).getByRole('img');
				await expect(logo).toBeVisible();
				// The image loaded, rather than showing as broken.
				await expect
					.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth))
					.toBeGreaterThan(0);
				const nav = header.getByRole('navigation');
				for (const link of PAGES) {
					await expect(nav.getByRole('link', { name: link.name, exact: true })).toBeVisible();
				}
				await expect(page.getByRole('contentinfo')).toBeVisible();
				await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
				// Text gets wider or narrower when the fonts arrive, so measure after they have.
				await page.evaluate(async () => {
					await document.fonts.ready;
				});
				expect(await sidewaysOverflow(page)).toBe(0);
			});
		}
	});
}

test('the logo goes to the home page', async ({ page }) => {
	await page.goto('/about');
	await page.getByRole('banner').getByRole('link', { name: 'Guzzling Goat Coffee' }).click();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('heading', { level: 1, name: 'Home', exact: true })).toBeVisible();
});

// Every page links the favicon and apple-touch-icon from src/app.html, and loads nothing from the
// old WordPress site or its hosting (GGW-3).

for (const { path } of PAGES) {
	test(`${path} links a favicon and apple-touch-icon that load`, async ({ page, request }) => {
		await page.goto(path);
		for (const rel of ['icon', 'apple-touch-icon']) {
			const link = page.locator(`head link[rel="${rel}"]`);
			const href = await link.evaluate((el: HTMLLinkElement) => el.href);
			expect((await request.get(href)).status(), rel).toBe(200);
		}
	});

	test(`${path} loads nothing from the old WordPress hosting`, async ({ page }) => {
		expect(await oldHostsRequested(page, path)).toEqual([]);
	});
}
