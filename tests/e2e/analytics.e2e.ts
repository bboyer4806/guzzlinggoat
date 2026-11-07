import { expect, test } from '@playwright/test';
import { PAGES } from '../../src/lib/site.ts';
import { gotoOnSite, tagCommands } from './helpers';

// Google Analytics through the Google tag (GGW-11): every page loads it on guzzlinggoat.com, and no
// page loads it anywhere else. shop.e2e.ts, wholesale.e2e.ts and contact.e2e.ts check the events.

const TAG_SCRIPT = 'https://www.googletagmanager.com/gtag/js?id=GT-P8QDNSQT';

for (const { path } of PAGES) {
	test(`on guzzlinggoat.com, ${path} loads and starts the Google tag`, async ({ page }) => {
		const loaded: string[] = [];
		page.on('requestfinished', (request) => loaded.push(request.url()));
		await gotoOnSite(page, path);
		// The script loads only if the site's Content Security Policy allows it.
		expect(loaded).toContain(TAG_SCRIPT);
		expect(await tagCommands(page)).toEqual([
			['js', expect.any(Date)],
			['config', 'GT-P8QDNSQT']
		]);
	});

	test(`on any other host, ${path} loads no Google tag`, async ({ page }) => {
		const hosts: string[] = [];
		page.on('request', (request) => hosts.push(new URL(request.url()).hostname));
		await page.goto(path, { waitUntil: 'networkidle' });
		expect(hosts.filter((host) => host.endsWith('googletagmanager.com'))).toEqual([]);
		expect(await tagCommands(page)).toEqual([]);
	});
}
