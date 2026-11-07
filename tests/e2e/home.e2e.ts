import { expect, test } from '@playwright/test';

// The Home page (GGW-4), built from GGW-2's approved mockup. layout.e2e.ts checks that it
// doesn't scroll sideways at 375, 768 and 1280px, as it does for every page.

const HEADINGS = [
	{ level: 1, name: 'Experience Pure Ethiopian Coffee' },
	{ level: 2, name: 'Powerfully Unique Flavor' },
	{ level: 2, name: 'Discover the Legend' }
];

// The copy from the WordPress site, with its typos fixed, which the page keeps word for word.
const COPY = [
	'Ethiopians first discovered and brewed coffee over a millennium ago. Our coffee was grown and roasted by those descendants.',
	'Most coffee beans are simply imported from other countries and then roasted in the United States. Our coffee is roasted at the source.',
	'Our coffee packs a powerful, full-bodied Arabica mocha flavor with a distinct, fragrant aroma.',
	'Local Ethiopian legend tells the story of a goat farmer who was missing goats from his herd during the day. These goats would return with a tremendous spring in their step. After following these mischievous goats, he discovered that they were eating a strange bean from a bush. He ate the beans himself, and coffee was discovered.'
];

test('/ shows its headings and the copy from the WordPress site', async ({ page }) => {
	await page.goto('/');
	for (const { level, name } of HEADINGS) {
		await expect(page.getByRole('heading', { level, name, exact: true })).toBeVisible();
	}
	for (const text of COPY) {
		await expect(page.getByText(text, { exact: true })).toBeVisible();
	}
});

// The first screen of a 375px-wide iPhone (13 mini) and of a 1280px-wide desktop browser, as
// Playwright's device list sizes them.
for (const viewport of [
	{ width: 375, height: 629 },
	{ width: 1280, height: 720 }
]) {
	test.describe(`at ${viewport.width}x${viewport.height}`, () => {
		test.use({ viewport });

		test('/ shows Wholesale and Buy without scrolling, Wholesale before or beside Buy and at least as large', async ({
			page
		}) => {
			await page.goto('/');
			// The fonts set the buttons' size and where they fall, so measure after they've loaded.
			await page.evaluate(async () => {
				await document.fonts.ready;
			});
			const main = page.getByRole('main');
			const wholesale = main.getByRole('link', { name: 'Wholesale inquiries' });
			// The page also ends with a Buy button.
			const buy = main.getByRole('link', { name: 'Buy a bag' }).first();
			await expect(wholesale).toHaveAttribute('href', '/wholesale');
			await expect(buy).toHaveAttribute('href', '/shop');
			await expect(wholesale).toBeInViewport({ ratio: 1 });
			await expect(buy).toBeInViewport({ ratio: 1 });
			const wholesaleBox = (await wholesale.boundingBox())!;
			const buyBox = (await buy.boundingBox())!;
			// Before Buy or beside it, never below it.
			expect(wholesaleBox.y).toBeLessThanOrEqual(buyBox.y);
			expect(wholesaleBox.width).toBeGreaterThanOrEqual(buyBox.width);
			expect(wholesaleBox.height).toBeGreaterThanOrEqual(buyBox.height);
		});
	});
}
