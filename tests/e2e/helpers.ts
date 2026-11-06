import type { Page } from '@playwright/test';

// Shared by the browser tests.

/** The old WordPress site and its hosting, which no page loads anything from (GGW-3). */
const OLD_HOSTS = ['guzzlinggoat.com', 'mybluehost.me', 'wp.com'];

/** Opens the page and returns every host it asked for anything that is old WordPress hosting. */
export async function oldHostsRequested(page: Page, path: string) {
	const hosts: string[] = [];
	page.on('request', (request) => hosts.push(new URL(request.url()).hostname));
	// Waits until the page stops making requests, not just for its first load.
	await page.goto(path, { waitUntil: 'networkidle' });
	return hosts.filter((host) =>
		OLD_HOSTS.some((oldHost) => host === oldHost || host.endsWith(`.${oldHost}`))
	);
}

/** How much wider the page is than the window: anything over 0 scrolls sideways. */
export function sidewaysOverflow(page: Page) {
	return page.evaluate(async () => {
		// Text gets wider or narrower when the fonts arrive, so measure after they have.
		await document.fonts.ready;
		return document.documentElement.scrollWidth - document.documentElement.clientWidth;
	});
}
