import { onSiteHost, siteUrl } from '#lib/site.ts';
import type { RequestHandler } from './$types';

// Crawlers may read everything on guzzlinggoat.com, and nothing on any other host (GGW-10).
export const GET: RequestHandler = ({ url }) => {
	const robots = onSiteHost(url)
		? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl('/sitemap.xml')}\n`
		: 'User-agent: *\nDisallow: /\n';
	return new Response(robots);
};
