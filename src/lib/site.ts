// What search engines and link previews see of the site (GGW-10).

/** The one host search engines may index. Canonical links, the share image and the sitemap use it. */
const HOST = 'guzzlinggoat.com';

/** A path's full address on guzzlinggoat.com. */
export function siteUrl(path: string) {
	return `https://${HOST}${path}`;
}

/**
 * Whether a URL, such as a request's or the page's, is on guzzlinggoat.com, rather than the dev site
 * or any other host.
 */
export function onSiteHost(url: Pick<URL, 'hostname'>) {
	return url.hostname === HOST;
}

/**
 * Each page's path, title and description. The layout gives a page its head tags from here and the
 * sitemap lists these pages, so a new page needs only a line here.
 */
export const PAGES = [
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

/** The photo every page's link preview shows. */
export const SHARE_IMAGE = siteUrl('/photos/25-bag-on-burlap.webp');
