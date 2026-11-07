import { building, dev } from '$app/env';
import { resendConfig } from '#lib/server/email.ts';
import { onSiteHost } from '#lib/site.ts';
import { redirect } from '@sveltejs/kit';
import type { Handle, ServerInit } from '@sveltejs/kit/hooks';

// The built app refuses to start without its email settings, instead of failing on the first form
// submission. The build and the dev server start without them.
export const init: ServerInit = () => {
	if (!dev && !building) resendConfig();
};

/**
 * Old WordPress URLs and the pages that replace them (GGW-10). An old URL of a page the site still
 * has, such as /about/, needs no line: SvelteKit permanently redirects it to the path without the
 * slash.
 */
const OLD_URLS: Record<string, string> = {
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

export const handle: Handle = async ({ event, resolve }) => {
	const target = OLD_URLS[event.url.pathname];
	if (target) redirect(301, target);

	const response = await resolve(event);
	// Search engines index guzzlinggoat.com only, and never the design mockups under /design.
	if (!onSiteHost(event.url) || /^\/design(\/|$)/.test(event.url.pathname)) {
		response.headers.set('x-robots-tag', 'noindex');
	}
	return response;
};
