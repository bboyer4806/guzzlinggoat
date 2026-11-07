import { PAGES, siteUrl } from '#lib/site.ts';

// The site's pages at their guzzlinggoat.com addresses, for search engines (GGW-10).
export function GET() {
	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...PAGES.map(({ path }) => `\t<url><loc>${siteUrl(path)}</loc></url>`),
		'</urlset>',
		''
	].join('\n');
	return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}
