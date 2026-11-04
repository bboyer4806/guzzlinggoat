import { text } from '@sveltejs/kit';

// Dokku checks this before it switches traffic to a new version, and the deploy checks it after.
export function GET() {
	return text('ok');
}
