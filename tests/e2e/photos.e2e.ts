import { readdirSync, statSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// The pool of site photos that pages pick from (GGW-3).

const DIR = new URL('../../static/photos/', import.meta.url);

test('static/photos holds the 28 photos as WebP, at most 1600px wide and under 300 KB', async ({
	page
}) => {
	const files = readdirSync(DIR);
	expect(files).toHaveLength(28);
	// Any page will do: the browser decodes each photo the site serves to read its width.
	await page.goto('/');
	for (const file of files) {
		expect(file).toMatch(/^\d{2}-[a-z-]+\.webp$/);
		expect(statSync(new URL(file, DIR)).size, file).toBeLessThan(300_000);
		const width = await page.evaluate(async (src) => {
			const img = new Image();
			img.src = src;
			await img.decode();
			return img.naturalWidth;
		}, `/photos/${file}`);
		expect(width, file).toBeLessThanOrEqual(1600);
	}
});
