// Checks a form submission in the form's action. Each rule carries the message that tells the
// visitor what to fix, so the forms say it the same way.
import { fail } from '@sveltejs/kit';
import * as z from 'zod';

/** A text field that has to be filled in. It's trimmed, so spaces alone don't count. */
export function required(message: string) {
	return z.string().trim().min(1, message);
}

/** An email field, which has to hold a valid address. */
export const email = required('Enter your email address').pipe(
	z.email('Enter a valid email address, like name@example.com')
);

/**
 * Checks the submitted fields against the form's schema. Returns the parsed fields, or the failure
 * for the action to return: each field's message and what the visitor typed, for the page to show.
 */
export function parseForm<Schema extends z.ZodObject>(schema: Schema, formData: FormData) {
	type Name = keyof Schema['shape'];

	// A field missing from the submission counts as empty, so it gets the field's own message.
	const values = Object.fromEntries(
		Object.keys(schema.shape).map((name) => [name, String(formData.get(name) ?? '')])
	) as Record<Name, string>;

	const result = schema.safeParse(values);
	if (result.success) return { data: result.data };

	const errors: Partial<Record<Name, string>> = {};
	for (const { path, message } of result.error.issues) errors[path[0] as Name] ??= message;
	return { failure: fail(400, { values, errors }) };
}
