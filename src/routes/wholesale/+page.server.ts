import { fail } from '@sveltejs/kit';
import * as z from 'zod';
import { HONEYPOT_FIELD } from '#lib/Honeypot.svelte';
import { sendSubmission } from '#lib/server/email.ts';
import { email, parseForm, required } from '#lib/server/forms.ts';
import type { Actions } from './$types';

const Inquiry = z.object({
	name: required('Enter your name'),
	business: required('Enter your business name'),
	businessType: required('Enter your business type'),
	email,
	message: required('Enter a message')
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parseForm(Inquiry, formData);
		if (parsed.failure) return parsed.failure;

		const inquiry = parsed.data;
		try {
			await sendSubmission({
				form: 'Wholesale inquiry',
				email: inquiry.email,
				fields: {
					Name: inquiry.name,
					'Business name': inquiry.business,
					'Business type': inquiry.businessType,
					Email: inquiry.email,
					Message: inquiry.message
				},
				honeypot: formData.get(HONEYPOT_FIELD)
			});
		} catch (error) {
			console.error(error);
			return fail(500, { values: inquiry, sendFailed: true });
		}
		return { sent: true };
	}
} satisfies Actions;
