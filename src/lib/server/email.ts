// Emails form submissions to Brian through Resend's API
// (https://resend.com/docs/api-reference/emails/send-email). It's server-only, so the API key never
// reaches the browser.

const TO = 'bboyer@webpyro.com';
const FROM = 'forms@guzzlinggoat.com';

export interface Submission {
	/** Starts the subject, such as "Wholesale inquiry". */
	form: string;
	/** The submitter's address, which replies go to. */
	email: string;
	/** Each field's label and value, in the order the email lists them. */
	fields: Record<string, string>;
	/** The value of the form's honeypot field (src/lib/Honeypot.svelte). */
	honeypot: FormDataEntryValue | null;
}

/**
 * Sends Brian one email with a form submission. A submission with the honeypot filled in comes from
 * a bot, so it sends nothing and returns as if it had. Throws if Resend refuses the email, so the
 * form can log the error and tell the visitor.
 */
export async function sendSubmission({ form, email, fields, honeypot }: Submission) {
	if (honeypot) {
		console.info(`Dropped a ${form}: its honeypot field was filled in`);
		return;
	}

	const { baseUrl, apiKey } = resendConfig();
	const response = await fetch(`${baseUrl}/emails`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			// Resend refuses requests without one.
			'User-Agent': 'guzzlinggoat'
		},
		body: JSON.stringify({
			from: FROM,
			to: TO,
			reply_to: email,
			// Naming the submitter keeps mail clients from threading different people's messages together.
			subject: `${form} from ${email}`,
			text: Object.entries(fields)
				.map(([label, value]) => `${label}: ${value}`)
				.join('\n\n')
		})
	});

	if (!response.ok) {
		throw new Error(`Resend refused the ${form} (${response.status}): ${await response.text()}`);
	}
}

/**
 * Where emails go and the key that sends them. The Dockerfile points RESEND_BASE_URL at Resend and
 * the server holds RESEND_API_KEY. Tests and `npm run dev` point them at the local stub
 * (scripts/resend-stub.mjs), so they never send real email. Throws naming a variable that isn't
 * set; the built app calls this when it starts (src/hooks.server.ts).
 */
export function resendConfig() {
	return { baseUrl: required('RESEND_BASE_URL'), apiKey: required('RESEND_API_KEY') };
}

function required(name: string) {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is not set`);
	return value;
}
