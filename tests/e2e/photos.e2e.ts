import { readdirSync, statSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// The pool of site photos that pages pick from (GGW-3), plus larger versions of 25 and 27 for wide
// screens, made from their originals (GGW-2).

const DIR = new URL('../../static/photos/', import.meta.url);

const LARGE = ['25-bag-on-burlap-large.webp', '27-traditional-roasting-pan-large.webp'];

test('static/photos holds the 28 photos as WebP, at most 1600px wide and under 300 KB', async ({
	page
}) => {
	const files = readdirSync(DIR).filter((file) => !LARGE.includes(file));
	expect(files).toHaveLength(28);
	// Any page will do: the browser decodes each photo the site serves to read its width.
	await page.goto('/');
	for (const file of files) {
		expect(file).toMatch(/^\d{2}-[a-z-]+\.webp$/);
		expect(statSync(new URL(file, DIR)).size, file).toBeLessThan(300_000);
		expect(await width(page, file), file).toBeLessThanOrEqual(1600);
	}
});

test('static/photos holds large versions of 25 and 27, wider than 1600px and under 1 MB', async ({
	page
}) => {
	await page.goto('/');
	for (const file of LARGE) {
		expect(statSync(new URL(file, DIR)).size, file).toBeLessThan(1_000_000);
		expect(await width(page, file), file).toBeGreaterThan(1600);
	}
});

/** The width of a photo as the browser decodes it. */
function width(page: Page, file: string) {
	return page.evaluate(async (src) => {
		const img = new Image();
		img.src = src;
		await img.decode();
		return img.naturalWidth;
	}, `/photos/${file}`);
}
