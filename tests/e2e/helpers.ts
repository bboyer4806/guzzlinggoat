import type { Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

// Shared by the tests.

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
	return page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
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
