import { expect, test } from '@playwright/test';

// The Shop page (GGW-6): one product, bought on Amazon. layout.e2e.ts checks that the page has no
// sideways scroll at 375, 768 and 1280px.

/** The product on Amazon, tagged so that Amazon Attribution credits the sale to the site. */
const AMAZON_URL =
	'https://www.amazon.com/Guzzling-Goat-Ethiopian-Coffee-Flavorful/dp/B0FBBL6K55/?maas=maas_adg_22B6465B489CF19BB0B02DBC2920D706_afap_abs&ref_=aa_maas&tag=maas';

test('/shop shows the product name, short line, specs and photo, and no price', async ({
	page
}) => {
	await page.goto('/shop');
	await expect(
		page.getByRole('heading', {
			level: 1,
			name: 'Guzzling Goat Whole Bean Medium Roast Ethiopian Coffee',
			exact: true
		})
	).toBeVisible();
	await expect(
		page.getByText('Whole bean, medium roast, grown and roasted in Ethiopia.', { exact: true })
	).toBeVisible();
	const main = page.getByRole('main');
	await expect(main.getByRole('term')).toHaveText(['Weight', 'Form', 'Roast', 'Flavor']);
	await expect(main.getByRole('definition')).toHaveText(['1 lb', 'Whole bean', 'Medium', 'Mocha']);
	const photo = main.getByRole('img', {
		name: 'A bag of Guzzling Goat Coffee on burlap beside a bowl of roasted beans'
	});
	await expect(photo).toBeVisible();
	await expect(photo).toHaveAttribute('src', '/photos/25-bag-on-burlap.webp');
	// The photo loaded, rather than showing as broken.
	await expect
		.poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
		.toBeGreaterThan(0);
	// Amazon sets the price. innerText is the text on screen, without the page's scripts.
	await expect(page.locator('body')).not.toContainText('$', { useInnerText: true });
});

test('the Buy button opens the tagged Amazon URL in a new tab', async ({ page }) => {
	await page.goto('/shop');
	const buy = page.getByRole('link', { name: 'Buy on Amazon' });
	await expect(buy).toHaveAttribute('href', AMAZON_URL);
	await expect(buy).toHaveAttribute('target', '_blank');
});

test('/shop links bulk buyers to /wholesale', async ({ page }) => {
	await page.goto('/shop');
	// The page asks twice; the first is under the Buy button.
	await page.getByRole('main').getByRole('link', { name: 'Ask about wholesale' }).first().click();
	await expect(page).toHaveURL('/wholesale');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Wholesale', exact: true })
	).toBeVisible();
});
