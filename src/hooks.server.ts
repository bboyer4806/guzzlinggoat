import { building, dev } from '$app/env';
import { resendConfig } from '#lib/server/email.ts';
import type { ServerInit } from '@sveltejs/kit/hooks';

// The built app refuses to start without its email settings, instead of failing on the first form
// submission. The build and the dev server start without them.
export const init: ServerInit = () => {
	if (!dev && !building) resendConfig();
};
