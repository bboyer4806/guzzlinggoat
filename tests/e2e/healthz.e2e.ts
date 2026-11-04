import { expect, test } from '@playwright/test';

test('/healthz answers 200', async ({ request }) => {
	const response = await request.get('/healthz');
	expect(response.status()).toBe(200);
});
