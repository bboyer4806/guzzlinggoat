import { expect, test, type Page } from '@playwright/test';
import { analyticsEvents, emailsFrom, gotoOnSite, uniqueEmail } from './helpers';

// The Contact page (GGW-8): the approved /design/contact mockup, with a form that emails through
// GGW-9's path, which playwright.config.ts points at the Resend stub. layout.e2e.ts checks that it
// doesn't scroll sideways at 375, 768 and 1280px, as it does for every page.

const COPY = [
	"We'd love to hear from you! We're here to answer your questions, listen to your suggestions, or help with your order.",
	'Interested in carrying Guzzling Goat at your business? Visit our Wholesale page.'
];

const THANKS = "Thanks! We'll be in touch soon.";
const NOT_SENT = "Sorry, your message didn't send. Please try again.";
const INVALID_EMAIL = 'Enter a valid email address, like name@example.com';

/** Each required field's message when it's left empty, by label. */
const EMPTY_ERRORS = {
	'First name': 'Enter your first name',
	Email: 'Enter your email address',
	Message: 'Enter a message'
};

/** A message as a visitor would fill it in, by label. */
function contact(email: string) {
	return {
		'First name': 'Jane',
		'Last name (optional)': 'Doe',
		Email: email,
		Message: 'Do you ship to Canada?\nI drink a pot a day.'
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
	await page.getByRole('button', { name: 'Send message' }).click();
}

test('/contact shows the contact copy', async ({ page }) => {
	await page.goto('/contact');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Contact Us', exact: true })
	).toBeVisible();
	for (const text of COPY) await expect(page.getByRole('main')).toContainText(text);
});

test('the Wholesale line goes to /wholesale', async ({ page }) => {
	await page.goto('/contact');
	await page.getByRole('main').getByRole('link', { name: 'Wholesale', exact: true }).click();
	await expect(page).toHaveURL('/wholesale');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Wholesale', exact: true })
	).toBeVisible();
});

for (const lastName of ['Doe', '']) {
	test(`a valid message ${lastName ? 'with' : 'without'} a last name sends one email, then thanks the visitor`, async ({
		page
	}) => {
		await page.goto('/contact');
		const email = uniqueEmail();
		const fields = { ...contact(email), 'Last name (optional)': lastName };
		await send(page, fields);
		await expect(page.getByRole('status')).toHaveText(THANKS);
		expect(await emailsFrom(email)).toEqual([
			{
				from: 'forms@guzzlinggoat.com',
				to: 'bboyer@webpyro.com',
				reply_to: email,
				subject: `Contact message from ${email}`,
				text: `First name: Jane\n\nLast name: ${lastName}\n\nEmail: ${email}\n\nMessage: Do you ship to Canada?\nI drink a pot a day.`
			}
		]);
		// The form is empty, ready for another message.
		for (const label of Object.keys(fields)) await expect(field(page, label)).toHaveValue('');
	});
}

for (const [label, error] of Object.entries(EMPTY_ERRORS)) {
	test(`leaving ${label} empty says to fill it in, keeps the rest and sends nothing`, async ({
		page
	}) => {
		await page.goto('/contact');
		const fields = { ...contact(uniqueEmail()), [label]: '' };
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
	await page.goto('/contact');
	const email = uniqueEmail().replace('@', '.');
	await send(page, contact(email));
	await expect(field(page, 'Email')).toHaveAccessibleDescription(INVALID_EMAIL);
	await expect(field(page, 'Email')).toHaveAttribute('aria-invalid', 'true');
	expect(await emailsFrom(email)).toEqual([]);
});

test('after a field error, the first field to fix has focus', async ({ page }) => {
	// The page's JavaScript moves the focus, so this waits for it to load.
	await page.goto('/contact', { waitUntil: 'networkidle' });
	await send(page, { ...contact(uniqueEmail()), 'First name': '', Message: '' });
	await expect(field(page, 'First name')).toBeFocused();
});

test("when the email doesn't send, the page says so and keeps what the visitor typed", async ({
	page
}) => {
	await page.goto('/contact');
	// The stub refuses email that replies to this address.
	const fields = contact('rejected@example.com');
	await send(page, fields);
	await expect(page.getByRole('alert')).toHaveText(NOT_SENT);
	for (const [label, value] of Object.entries(fields)) {
		await expect(field(page, label)).toHaveValue(value);
	}
});

test('only a message that sends counts in Google Analytics, as contact_message (GGW-11)', async ({
	page
}) => {
	await gotoOnSite(page, '/contact');
	await send(page, contact('rejected.example.com'));
	await expect(field(page, 'Email')).toHaveAccessibleDescription(INVALID_EMAIL);
	// The stub refuses email that replies to this address.
	await send(page, { Email: 'rejected@example.com' });
	await expect(page.getByRole('alert')).toHaveText(NOT_SENT);
	expect(await analyticsEvents(page)).toEqual([]);

	await send(page, { Email: uniqueEmail() });
	await expect(page.getByRole('status')).toHaveText(THANKS);
	expect(await analyticsEvents(page)).toEqual(['contact_message']);
});

// A visitor who sends the form before the page's JavaScript loads gets a new page from the server,
// which fills the form back in.
test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('a field error and a failed send both keep what the visitor typed', async ({ page }) => {
		await page.goto('/contact');
		const fields = contact('rejected.example.com');
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

test('a message with the hidden honeypot field filled in sends nothing, but still thanks', async ({
	page
}) => {
	await page.goto('/contact');
	const honeypot = page.locator('form input[name="website"]');
	await expect(honeypot).toBeHidden();
	// Only a bot fills in a field nobody can see, so the test sets it directly.
	await honeypot.evaluate((input: HTMLInputElement) => (input.value = 'https://spam.example'));
	const email = uniqueEmail();
	await send(page, contact(email));
	await expect(page.getByRole('status')).toHaveText(THANKS);
	expect(await emailsFrom(email)).toEqual([]);
});
