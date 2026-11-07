import { fail } from '@sveltejs/kit';
import * as z from 'zod';
import { HONEYPOT_FIELD } from '#lib/Honeypot.svelte';
import { sendSubmission } from '#lib/server/email.ts';
import { email, parseForm, required } from '#lib/server/forms.ts';
import type { Actions } from './$types';

const Contact = z.object({
	firstName: required('Enter your first name'),
	// Optional, so it's only trimmed.
	lastName: z.string().trim(),
	email,
	message: required('Enter a message')
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parseForm(Contact, formData);
		if (parsed.failure) return parsed.failure;

		const contact = parsed.data;
		try {
			await sendSubmission({
				form: 'Contact message',
				email: contact.email,
				fields: {
					'First name': contact.firstName,
					'Last name': contact.lastName,
					Email: contact.email,
					Message: contact.message
				},
				honeypot: formData.get(HONEYPOT_FIELD)
			});
		} catch (error) {
			console.error(error);
			return fail(500, { values: contact, sendFailed: true });
		}
		return { sent: true };
	}
} satisfies Actions;
