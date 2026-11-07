import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Runes mode everywhere except in dependencies.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			// The Google hosts are the ones Google lists for Google Analytics, which the Google tag loads
			// from and sends to on guzzlinggoat.com (GGW-11):
			// https://developers.google.com/tag-platform/security/guides/csp
			csp: {
				mode: 'auto',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', 'https://*.googletagmanager.com'],
					'style-src': ['self', 'unsafe-inline'],
					'img-src': [
						'self',
						'data:',
						'https://*.google-analytics.com',
						'https://*.googletagmanager.com'
					],
					'font-src': ['self'],
					'connect-src': [
						'self',
						'https://*.google-analytics.com',
						'https://*.analytics.google.com',
						'https://*.googletagmanager.com'
					],
					'form-action': ['self'],
					'frame-ancestors': ['none'],
					'base-uri': ['self'],
					'object-src': ['none']
				}
			}
		})
	],
	// The tests ask the preview server for pages as guzzlinggoat.com, to check what search engines
	// see there (GGW-10), and as www.guzzlinggoat.com, to check that it redirects (GGW-12). Vite
	// answers only to localhost unless told otherwise.
	preview: { allowedHosts: ['guzzlinggoat.com', 'www.guzzlinggoat.com'] }
});
