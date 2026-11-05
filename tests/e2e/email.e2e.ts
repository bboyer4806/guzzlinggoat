import { expect, test } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { sendSubmission } from '../../src/lib/server/email.ts';

// The shared path that emails form submissions (GGW-9). These tests call it directly, and
// playwright.config.ts points it at the Resend stub (scripts/resend-stub.mjs).

test('sends Brian one email from forms@guzzlinggoat.com that replies to the submitter', async () => {
	const email = uniqueEmail();
	await sendSubmission({
		form: 'Wholesale inquiry',
		email,
		fields: { Name: 'Jane Doe', Email: email, Message: 'First line\nSecond line' },
		honeypot: ''
	});
	expect(await emailsFrom(email)).toEqual([
		{
			from: 'forms@guzzlinggoat.com',
			to: 'bboyer@webpyro.com',
			reply_to: email,
			subject: `Wholesale inquiry from ${email}`,
			text: `Name: Jane Doe\n\nEmail: ${email}\n\nMessage: First line\nSecond line`
		}
	]);
});

test('a submission with the honeypot filled in sends nothing', async () => {
	const email = uniqueEmail();
	await sendSubmission({
		form: 'Contact message',
		email,
		fields: { Email: email },
		honeypot: 'https://spam.example'
	});
	expect(await emailsFrom(email)).toEqual([]);
});

test('throws when Resend refuses the email', async () => {
	const submission = { form: 'Contact message', email: 'rejected@example.com', fields: {} };
	await expect(sendSubmission({ ...submission, honeypot: '' })).rejects.toThrow(
		'Resend refused the Contact message (422)'
	);
});

test('the built app refuses to start without RESEND_API_KEY', () => {
	// Runs the build the way the Dockerfile does, minus the key. If the app starts, the timeout
	// stops it and the test fails.
	const { status, stderr } = spawnSync(process.execPath, ['build'], {
		env: { NODE_ENV: 'production', PORT: '0', RESEND_BASE_URL: 'https://api.resend.com' },
		encoding: 'utf8',
		timeout: 10_000
	});
	expect(stderr).toContain('RESEND_API_KEY is not set');
	expect(status).toBe(1);
});

function uniqueEmail() {
	return `${randomUUID()}@example.com`;
}

/** The emails the stub accepted from this submitter, oldest first. */
async function emailsFrom(email: string) {
	const response = await fetch(`${process.env.RESEND_BASE_URL}/emails`);
	const emails: { reply_to: string }[] = await response.json();
	return emails.filter((sent) => sent.reply_to === email);
}
