import { expect, test } from '@playwright/test';

// The About page (GGW-5), built from GGW-2's approved mockup. layout.e2e.ts checks that it
// doesn't scroll sideways at 375, 768 and 1280px, as it does for every page.

// The About copy from the WordPress site, with its typos fixed, which the page keeps word for word.
// The first paragraph is the legend, which / tells too.
const COPY = [
	'Local Ethiopian legend tells the story of a goat farmer who was missing goats from his herd during the day. These goats would return with a tremendous spring in their step. After following these mischievous goats, he discovered that they were eating a strange bean from a bush. He ate the beans himself, and coffee was discovered.',
	'Guzzling Goat Coffee is made from 100% Arabica coffee grown and roasted in the homeland of coffee: Ethiopia. The coffee beans are hand selected by a local expert born and raised in Ethiopia. Unlike most other coffees, Guzzling Goat Coffee is actually roasted in Ethiopia using processes that have been perfected over many generations. Experience the energy-boosting flavor that only the homeland of coffee can provide.'
];

test('/about shows the About Us heading and the copy from the WordPress site', async ({ page }) => {
	await page.goto('/about');
	await expect(
		page.getByRole('heading', { level: 1, name: 'About Us', exact: true })
	).toBeVisible();
	for (const text of COPY) {
		await expect(page.getByText(text, { exact: true })).toBeVisible();
	}
});

test('/about tells the legend word for word as / does', async ({ page }) => {
	const legends: string[] = [];
	for (const path of ['/', '/about']) {
		await page.goto(path);
		legends.push(await page.getByText(/^Local Ethiopian legend/).innerText());
	}
	expect(legends[1]).toBe(legends[0]);
});

for (const { name, path } of [
	{ name: 'Wholesale inquiries', path: '/wholesale' },
	{ name: 'Buy a bag', path: '/shop' }
]) {
	test(`/about's ${name} link goes to ${path}`, async ({ page }) => {
		await page.goto('/about');
		// The header and footer link to both pages too, so this looks only in the page's own content.
		await page.getByRole('main').getByRole('link', { name, exact: true }).click();
		await expect(page).toHaveURL(path);
	});
}
