// Google Analytics through the Google tag, carried over from the WordPress site's Site Kit setup
// (GGW-11). The layout loads the tag on guzzlinggoat.com only, so test runs and local development
// don't count.

/** The Google tag that Site Kit set up for the WordPress site. */
export const GOOGLE_TAG_ID = 'GT-P8QDNSQT';

/** What the site drives: a click on Buy on /shop, and a Wholesale or Contact form that sent. */
type AnalyticsEvent = 'amazon_click' | 'wholesale_inquiry' | 'contact_message';

declare global {
	interface Window {
		/** The Google tag's queue of commands, which its script reads once it loads. */
		dataLayer?: unknown[];
		/** Gives the Google tag a command. Set only where the tag loads. */
		gtag?: (...args: unknown[]) => void;
	}
}

/** Starts the Google tag. Its commands wait in `dataLayer` until the tag's script loads. */
export function startAnalytics() {
	const dataLayer = (window.dataLayer ??= []);
	window.gtag = function () {
		// The tag reads a command only from an arguments object, not from an array.
		dataLayer.push(arguments);
	};
	window.gtag('js', new Date());
	window.gtag('config', GOOGLE_TAG_ID);
}

/** Sends an event to Google Analytics. Does nothing where the tag isn't loaded, such as localhost. */
export function sendEvent(name: AnalyticsEvent) {
	window.gtag?.('event', name);
}
