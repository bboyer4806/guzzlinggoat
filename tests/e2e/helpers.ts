import { test, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

// Shared by the tests.

/**
 * guzzlinggoat.com, the only host that search engines index and that loads the Google tag.
 * vite.config.ts lets the tests' server answer to it.
 */
export const SITE_HOST = 'guzzlinggoat.com';

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

/**
 * Opens the page as guzzlinggoat.com, where it loads the Google tag (GGW-11), and waits for the
 * page's JavaScript, which starts the tag. The tests' server answers for the site. Google gets
 * nothing: the tag's script comes back empty, so the commands the page gives the tag stay in its
 * queue for `tagCommands` to read.
 */
export async function gotoOnSite(page: Page, path: string) {
	const server = test.info().project.use.baseURL;
	await page.route(`http://${SITE_HOST}/**`, async (route) => {
		const { pathname, search } = new URL(route.request().url());
		const response = await route.fetch({
			url: `${server}${pathname}${search}`,
			headers: { ...route.request().headers(), host: SITE_HOST }
		});
		await route.fulfill({ response });
	});
	await page.route('https://www.googletagmanager.com/**', (route) =>
		route.fulfill({ contentType: 'text/javascript', body: '' })
	);
	await page.goto(`http://${SITE_HOST}${path}`, { waitUntil: 'networkidle' });
}

/**
 * The commands the page gave the Google tag, oldest first, each as the list of its arguments. The
 * tag reads only commands pushed as an arguments object, so this leaves out anything else.
 */
export function tagCommands(page: Page) {
	return page.evaluate(() =>
		(window.dataLayer ?? [])
			.filter((command) => Object.prototype.toString.call(command) === '[object Arguments]')
			.map((command) => Array.from(command as ArrayLike<unknown>))
	);
}

/** The names of the events the page sent to Google Analytics, oldest first. */
export async function analyticsEvents(page: Page) {
	const commands = await tagCommands(page);
	return commands.filter(([command]) => command === 'event').map(([, name]) => name);
}

/** How much wider the page is than the window: anything over 0 scrolls sideways. */
export function sidewaysOverflow(page: Page) {
	return page.evaluate(async () => {
		// Text gets wider or narrower when the fonts arrive, so measure after they have.
		await document.fonts.ready;
		return document.documentElement.scrollWidth - document.documentElement.clientWidth;
	});
}

/** An email address no other test uses, so a test can find the emails it caused. */
export function uniqueEmail() {
	return `${randomUUID()}@example.com`;
}

/**
 * The emails the Resend stub (scripts/resend-stub.mjs) accepted that reply to this address, oldest
 * first. playwright.config.ts points form email at the stub.
 */
export async function emailsFrom(email: string) {
	const response = await fetch(`${process.env.RESEND_BASE_URL}/emails`);
	const emails: { reply_to: string }[] = await response.json();
	return emails.filter((sent) => sent.reply_to === email);
}
