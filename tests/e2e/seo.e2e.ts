import { expect, test } from '@playwright/test';
import { SITE_HOST } from './helpers';

// What search engines and link previews see (GGW-10): each page's head tags, the sitemap and
// robots.txt, noindex everywhere but guzzlinggoat.com, and redirects from the old WordPress URLs.
// Also the tag that verifies the site in Google Search Console (GGW-11).

const PAGES = [
	{
		path: '/',
		title: 'Guzzling Goat Coffee | Grown and Roasted in Ethiopia',
		description:
			'100% Arabica coffee grown and roasted in Ethiopia, the homeland of coffee. Full-bodied mocha flavor. Buy a bag or ask about wholesale.'
	},
	{
		path: '/about',
		title: 'About | Guzzling Goat Coffee',
		description:
			"The goat legend behind coffee's discovery, and how Guzzling Goat is hand selected and roasted in Ethiopia using generations-old methods."
	},
	{
		path: '/shop',
		title: 'Shop | Guzzling Goat Coffee',
		description:
			'Guzzling Goat whole bean medium roast Ethiopian coffee. A 1 lb bag of 100% Arabica with a mocha flavor, available on Amazon.'
	},
	{
		path: '/wholesale',
		title: 'Wholesale | Guzzling Goat Coffee',
		description:
			"Coffee roasted where it's grown. Wholesale Ethiopian coffee for cafes, restaurants, offices and retailers. Send us an inquiry."
	},
	{
		path: '/contact',
		title: 'Contact | Guzzling Goat Coffee',
		description:
			"Questions or suggestions about Guzzling Goat Coffee? Send us a message and we'll be in touch soon."
	}
];

const DESIGN_PAGES = [
	'/design',
	'/design/home',
	'/design/about',
	'/design/shop',
	'/design/wholesale',
	'/design/contact'
];

/** Old WordPress URLs and where each now goes. */
const OLD_URLS = {
	'/product/guzzling-goat-whole-bean-medium-roast-ethiopian-coffee/': '/shop',
	'/product-category/uncategorized/': '/shop',
	'/cart/': '/shop',
	'/checkout/': '/shop',
	'/my-account/': '/shop',
	'/sitemap_index.xml': '/sitemap.xml',
	'/wp-sitemap.xml': '/sitemap.xml',
	'/page-sitemap.xml': '/sitemap.xml',
	'/product-sitemap.xml': '/sitemap.xml',
	'/product_cat-sitemap.xml': '/sitemap.xml'
};

for (const { path, title, description } of PAGES) {
	test(`${path} has its title, description, canonical link and link preview`, async ({ page }) => {
		await page.goto(path);
		await expect(page).toHaveTitle(title);
		// The layout sets the title, so a page that set its own would add a second one. Each tag below
		// has to be there exactly once as well.
		const head = page.locator('head');
		await expect(head.locator('title')).toHaveCount(1);
		await expect(head.locator('meta[name="description"]')).toHaveAttribute('content', description);
		await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`https://guzzlinggoat.com${path}`
		);
		await expect(head.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
		await expect(head.locator('meta[property="og:description"]')).toHaveAttribute(
			'content',
			description
		);
		await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
			'content',
			'https://guzzlinggoat.com/photos/25-bag-on-burlap.webp'
		);
	});
}

for (const { path } of PAGES) {
	test(`${path} has the Google Search Console verification tag`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('head meta[name="google-site-verification"]')).toHaveAttribute(
			'content',
			'STLk8opVWnLcUvyd6I9dGfWHBsf3cCIVS8uDzXmQbog'
		);
	});
}

test('/sitemap.xml lists exactly the five pages, at their guzzlinggoat.com addresses', async ({
	request
}) => {
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toBe('application/xml');
	const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
	expect(urls.toSorted()).toEqual(
		PAGES.map(({ path }) => `https://guzzlinggoat.com${path}`).toSorted()
	);
});

test('on guzzlinggoat.com, /robots.txt allows everything and points to the sitemap', async ({
	request
}) => {
	const response = await request.get('/robots.txt', { headers: { host: SITE_HOST } });
	expect(await response.text()).toBe(
		'User-agent: *\nAllow: /\n\nSitemap: https://guzzlinggoat.com/sitemap.xml\n'
	);
});

test('on any other host, /robots.txt disallows everything', async ({ request }) => {
	const response = await request.get('/robots.txt');
	expect(await response.text()).toBe('User-agent: *\nDisallow: /\n');
});

for (const { path } of PAGES) {
	test(`${path} sends noindex on any host but guzzlinggoat.com`, async ({ request }) => {
		const onSite = await request.get(path, { headers: { host: SITE_HOST } });
		expect(onSite.status()).toBe(200);
		expect(onSite.headers()['x-robots-tag']).toBeUndefined();
		expect(await onSite.text()).not.toContain('noindex');

		const elsewhere = await request.get(path);
		expect(elsewhere.headers()['x-robots-tag']).toBe('noindex');
	});
}

for (const path of DESIGN_PAGES) {
	test(`${path} sends noindex, even on guzzlinggoat.com`, async ({ request }) => {
		const response = await request.get(path, { headers: { host: SITE_HOST } });
		expect(response.status()).toBe(200);
		expect(response.headers()['x-robots-tag']).toBe('noindex');
	});
}

for (const [from, to] of Object.entries(OLD_URLS)) {
	test(`the old WordPress URL ${from} redirects (301) to ${to}`, async ({ request }) => {
		const response = await request.get(from, { maxRedirects: 0 });
		expect(response.status()).toBe(301);
		expect(response.headers()['location']).toBe(to);
	});
}

// The old site's page URLs end in a slash. SvelteKit redirects them to the path without it, with a
// 308 Permanent Redirect.
for (const path of ['/about', '/shop', '/contact']) {
	test(`${path}/ ends at ${path} through a permanent redirect`, async ({ page }) => {
		const response = await page.goto(`${path}/`);
		expect(response?.status()).toBe(200);
		expect(new URL(page.url()).pathname).toBe(path);
		const redirect = await response?.request().redirectedFrom()?.response();
		expect(redirect?.status()).toBe(308);
	});
}
