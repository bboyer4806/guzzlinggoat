import { expect, test } from '@playwright/test';
import { oldHostsRequested, sidewaysOverflow } from './helpers';

// The design for approval (GGW-2): /design shows the palette and type and links to a mockup of each
// page, all under src/routes/design/.

const MOCKUPS = [
	{ path: '/design/home', name: 'Home' },
	{ path: '/design/about', name: 'About' },
	{ path: '/design/shop', name: 'Shop' },
	{ path: '/design/wholesale', name: 'Wholesale' },
	{ path: '/design/contact', name: 'Contact' }
];

const DESIGN_PAGES = ['/design', ...MOCKUPS.map(({ path }) => path)];

test('/design shows a swatch and hex value for each color, including the GGW-1 brand colors', async ({
	page
}) => {
	await page.goto('/design');
	const colors = await page.getByRole('list', { name: 'Palette' }).getByRole('listitem').all();
	const hexes: string[] = [];
	for (const color of colors) {
		const hex = await color.getByText(/^#[0-9A-F]{6}$/).innerText();
		await expect(color.locator('.swatch')).toHaveCSS('background-color', rgb(hex));
		hexes.push(hex);
	}
	expect(hexes).toEqual(expect.arrayContaining(['#B37602', '#000000', '#FFFFFF']));
});

test('/design names the heading and body fonts, with a sample of each in that font', async ({
	page
}) => {
	await page.goto('/design');
	await expect(page.getByText('Headings: Rokkitt')).toBeVisible();
	await expect(page.getByText('Experience Pure Ethiopian Coffee')).toHaveCSS(
		'font-family',
		/^"Rokkitt Variable"/
	);
	await expect(page.getByText('Body: Source Sans 3')).toBeVisible();
	await expect(page.getByText(/^Ethiopians first discovered/)).toHaveCSS(
		'font-family',
		/^"Source Sans 3 Variable"/
	);
	// Both fonts are served by the site itself, so they load under its content security policy.
	const loaded = await page.evaluate(async () => {
		await document.fonts.ready;
		return [...document.fonts]
			.filter((font) => font.status === 'loaded')
			.map((font) => font.family.replaceAll('"', ''));
	});
	expect(loaded).toEqual(expect.arrayContaining(['Rokkitt Variable', 'Source Sans 3 Variable']));
});

test('/design links to the five mockups', async ({ page }) => {
	await page.goto('/design');
	const list = page.getByRole('list', { name: 'Mockups' });
	for (const { path, name } of MOCKUPS) {
		await expect(list.getByRole('link', { name, exact: true })).toHaveAttribute('href', path);
	}
});

test("the main nav doesn't link to /design", async ({ page }) => {
	await page.goto('/design');
	const nav = page.getByRole('banner').getByRole('navigation');
	await expect(nav.getByRole('link')).toHaveCount(5);
	await expect(nav.locator('a[href^="/design"]')).toHaveCount(0);
});

for (const width of [375, 768, 1280]) {
	test.describe(`at ${width}px wide`, () => {
		test.use({ viewport: { width, height: 800 } });

		for (const path of DESIGN_PAGES) {
			test(`${path} shows the site's header, logo, nav and footer, with no sideways scroll`, async ({
				page
			}) => {
				const response = await page.goto(path);
				expect(response?.status()).toBe(200);
				const header = page.getByRole('banner');
				const logo = header.getByRole('link', { name: 'Guzzling Goat Coffee' }).getByRole('img');
				await expect(logo).toBeVisible();
				await expect(header.getByRole('navigation')).toBeVisible();
				await expect(page.getByRole('contentinfo')).toBeVisible();
				// Text gets wider or narrower when the fonts arrive, so measure after they have.
				await page.evaluate(async () => {
					await document.fonts.ready;
				});
				expect(await sidewaysOverflow(page)).toBe(0);
			});
		}
	});
}

// The first screen of a 375px-wide iPhone (13 mini) and of a 1280px-wide desktop browser, as
// Playwright's device list sizes them.
for (const viewport of [
	{ width: 375, height: 629 },
	{ width: 1280, height: 720 }
]) {
	test.describe(`at ${viewport.width}x${viewport.height}`, () => {
		test.use({ viewport });

		test('the Home mockup shows a link to Wholesale without scrolling', async ({ page }) => {
			await page.goto('/design/home');
			await page.evaluate(async () => {
				await document.fonts.ready;
			});
			const link = page.getByRole('main').getByRole('link', { name: /wholesale/i }).first();
			await expect(link).toHaveAttribute('href', '/wholesale');
			await expect(link).toBeInViewport({ ratio: 1 });
		});
	});
}

test('the Shop mockup has a Buy button that opens Amazon in a new tab', async ({ page }) => {
	await page.goto('/design/shop');
	const buy = page.getByRole('link', { name: 'Buy on Amazon' });
	await expect(buy).toBeVisible();
	await expect(buy).toHaveAttribute('href', /^https:\/\/www\.amazon\.com\//);
	await expect(buy).toHaveAttribute('target', '_blank');
});

const FORMS = [
	{
		path: '/design/wholesale',
		fields: ['Name', 'Business name', 'Business type', 'Email', 'Message'],
		button: 'Send inquiry'
	},
	{
		path: '/design/contact',
		fields: ['First name', 'Last name (optional)', 'Email', 'Message'],
		button: 'Send message'
	}
];

for (const { path, fields, button } of FORMS) {
	test(`${path} shows its form, and sending it does nothing`, async ({ page }) => {
		await page.goto(path);
		for (const name of fields) {
			const value = name === 'Email' ? 'buyer@example.com' : 'Test';
			await page.getByRole('textbox', { name, exact: true }).fill(value);
		}
		const navigations: string[] = [];
		page.on('request', (request) => {
			if (request.isNavigationRequest()) navigations.push(request.url());
		});
		await page.getByRole('button', { name: button }).click();
		expect(navigations).toEqual([]);
		await expect(page).toHaveURL(path);
		await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue(
			'buyer@example.com'
		);
	});
}

for (const path of DESIGN_PAGES) {
	test(`${path} loads every image from the site, none from the old WordPress hosting`, async ({
		page,
		request
	}) => {
		expect(await oldHostsRequested(page, path)).toEqual([]);
		const origin = new URL(page.url()).origin;
		const sources = await page
			.locator('img')
			.evaluateAll((images: HTMLImageElement[]) => images.map((image) => image.src));
		expect(sources.length).toBeGreaterThan(0);
		for (const source of sources) {
			expect(new URL(source).origin, source).toBe(origin);
			expect((await request.get(source)).status(), source).toBe(200);
		}
	});
}

/** A hex color as the browser reports it computed: '#B37602' is 'rgb(179, 118, 2)'. */
function rgb(hex: string) {
	const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
	return `rgb(${red}, ${green}, ${blue})`;
}
