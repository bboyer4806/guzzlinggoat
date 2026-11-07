import { expect, test, type Page } from '@playwright/test';
import { emailsFrom, uniqueEmail } from './helpers';

// The Wholesale page (GGW-7): the approved /design/wholesale mockup, with an inquiry form that
// emails through GGW-9's path, which playwright.config.ts points at the Resend stub.

const COPY = [
	"Serve coffee that's roasted where it's grown.",
	'Most coffee is shipped green and roasted in the United States. Guzzling Goat is 100% Arabica, grown and roasted in Ethiopia, the homeland of coffee, and hand selected by a local expert. Your customers get a full-bodied mocha flavor with a story worth telling.',
	'Who we work with',
	'Cafes and coffee shops',
	'Restaurants',
	'Offices',
	'Retailers',
	"Let's talk",
	"Tell us about your business and what you're looking for. We'll reply by email with options and pricing."
];

const THANKS = "Thanks! We'll be in touch soon.";
const NOT_SENT = "Sorry, your inquiry didn't send. Please try again.";
const INVALID_EMAIL = 'Enter a valid email address, like name@example.com';

/** Each field's message when it's left empty, by label. */
const EMPTY_ERRORS = {
	Name: 'Enter your name',
	'Business name': 'Enter your business name',
	'Business type': 'Enter your business type',
	Email: 'Enter your email address',
	Message: 'Enter a message'
};

/** An inquiry as a visitor would fill it in, by label. */
function inquiry(email: string) {
	return {
		Name: 'Jane Doe',
		'Business name': 'Goat Hill Cafe',
		'Business type': 'Cafe',
		Email: email,
		Message: 'We pour about 200 cups a day.\nWhich sizes do you sell?'
	};
}

function field(page: Page, label: string) {
	return page.getByRole('textbox', { name: label, exact: true });
}

async function fill(page: Page, fields: Record<string, string>) {
	for (const [label, value] of Object.entries(fields)) await field(page, label).fill(value);
}

/** Fills in the form and sends it. */
async function send(page: Page, fields: Record<string, string>) {
	await fill(page, fields);
	await page.getByRole('button', { name: 'Send inquiry' }).click();
}

test('/wholesale shows the wholesale copy', async ({ page }) => {
	await page.goto('/wholesale');
	for (const text of COPY) await expect(page.getByRole('main')).toContainText(text);
});

test('a valid inquiry sends one email with all five fields, then thanks the visitor', async ({
	page
}) => {
	await page.goto('/wholesale');
	const email = uniqueEmail();
	await send(page, inquiry(email));
	await expect(page.getByRole('status')).toHaveText(THANKS);
	expect(await emailsFrom(email)).toEqual([
		{
			from: 'forms@guzzlinggoat.com',
			to: 'bboyer@webpyro.com',
			reply_to: email,
			subject: `Wholesale inquiry from ${email}`,
			text: `Name: Jane Doe\n\nBusiness name: Goat Hill Cafe\n\nBusiness type: Cafe\n\nEmail: ${email}\n\nMessage: We pour about 200 cups a day.\nWhich sizes do you sell?`
		}
	]);
	// The form is empty, ready for another inquiry.
	for (const label of Object.keys(EMPTY_ERRORS)) await expect(field(page, label)).toHaveValue('');
});

for (const [label, error] of Object.entries(EMPTY_ERRORS)) {
	test(`leaving ${label} empty says to fill it in, keeps the rest and sends nothing`, async ({
		page
	}) => {
		await page.goto('/wholesale');
		const fields = { ...inquiry(uniqueEmail()), [label]: '' };
		await send(page, fields);
		await expect(field(page, label)).toHaveAccessibleDescription(error);
		await expect(field(page, label)).toHaveAttribute('aria-invalid', 'true');
		for (const [other, value] of Object.entries(fields)) {
			if (other === label) continue;
			await expect(field(page, other)).not.toHaveAttribute('aria-invalid');
			await expect(field(page, other)).toHaveValue(value);
		}
		// An email would reply to what's in the Email field, even when that's empty.
		expect(await emailsFrom(fields.Email)).toEqual([]);
	});
}

test('an invalid email says to fix it and sends nothing', async ({ page }) => {
	await page.goto('/wholesale');
	const email = uniqueEmail().replace('@', '.');
	await send(page, inquiry(email));
	await expect(field(page, 'Email')).toHaveAccessibleDescription(INVALID_EMAIL);
	await expect(field(page, 'Email')).toHaveAttribute('aria-invalid', 'true');
	expect(await emailsFrom(email)).toEqual([]);
});

test('after a field error, the first field to fix has focus', async ({ page }) => {
	// The page's JavaScript moves the focus, so this waits for it to load.
	await page.goto('/wholesale', { waitUntil: 'networkidle' });
	await send(page, { ...inquiry(uniqueEmail()), 'Business name': '', Message: '' });
	await expect(field(page, 'Business name')).toBeFocused();
});

test("what a visitor types while the page's JavaScript loads stays in the form", async ({
	page
}) => {
	// Holds back the JavaScript until the form is filled in, then lets it load and take over the page.
	let release = () => {};
	const held = new Promise<void>((resolve) => (release = resolve));
	await page.route('**/_app/immutable/entry/start.*.js', async (route) => {
		await held;
		await route.continue();
	});
	await page.goto('/wholesale', { waitUntil: 'domcontentloaded' });
	const fields = inquiry(uniqueEmail());
	await fill(page, fields);
	release();
	await page.waitForLoadState('networkidle');
	for (const [label, value] of Object.entries(fields)) {
		await expect(field(page, label)).toHaveValue(value);
	}
});

test("when the email doesn't send, the page says so and keeps what the visitor typed", async ({
	page
}) => {
	await page.goto('/wholesale');
	// The stub refuses email that replies to this address.
	const fields = inquiry('rejected@example.com');
	await send(page, fields);
	await expect(page.getByRole('alert')).toHaveText(NOT_SENT);
	for (const [label, value] of Object.entries(fields)) {
		await expect(field(page, label)).toHaveValue(value);
	}
});

// A visitor who sends the form before the page's JavaScript loads gets a new page from the server,
// which fills the form back in.
test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('a field error and a failed send both keep what the visitor typed', async ({ page }) => {
		await page.goto('/wholesale');
		const fields = inquiry('rejected.example.com');
		await send(page, fields);
		await expect(field(page, 'Email')).toHaveAccessibleDescription(INVALID_EMAIL);
		for (const [label, value] of Object.entries(fields)) {
			await expect(field(page, label)).toHaveValue(value);
		}

		// The stub refuses email that replies to this address.
		await send(page, { Email: 'rejected@example.com' });
		await expect(page.getByRole('alert')).toHaveText(NOT_SENT);
		for (const [label, value] of Object.entries({ ...fields, Email: 'rejected@example.com' })) {
			await expect(field(page, label)).toHaveValue(value);
		}
	});
});

test('an inquiry with the hidden honeypot field filled in sends nothing, but still thanks', async ({
	page
}) => {
	await page.goto('/wholesale');
	const honeypot = page.locator('form input[name="website"]');
	await expect(honeypot).toBeHidden();
	// Only a bot fills in a field nobody can see, so the test sets it directly.
	await honeypot.evaluate((input: HTMLInputElement) => (input.value = 'https://spam.example'));
	const email = uniqueEmail();
	await send(page, inquiry(email));
	await expect(page.getByRole('status')).toHaveText(THANKS);
	expect(await emailsFrom(email)).toEqual([]);
});
