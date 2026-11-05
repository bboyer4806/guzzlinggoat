import { expect, test, type Page } from '@playwright/test';

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

const OLD_HOSTS = ['guzzlinggoat.com', 'mybluehost.me', 'wp.com'];

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
		const hosts: string[] = [];
		page.on('request', (request) => hosts.push(new URL(request.url()).hostname));
		// Waits until the page stops making requests, not just for its first load.
		await page.goto(path, { waitUntil: 'networkidle' });
		const old = hosts.filter((host) =>
			OLD_HOSTS.some((oldHost) => host === oldHost || host.endsWith(`.${oldHost}`))
		);
		expect(old).toEqual([]);
	});
}

/** How much wider the page is than the window: anything over 0 scrolls sideways. */
function sidewaysOverflow(page: Page) {
	return page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
}
