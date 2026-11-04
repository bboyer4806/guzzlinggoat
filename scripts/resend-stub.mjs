// Stands in for Resend's API (https://resend.com/docs/api-reference/emails/send-email), so tests and
// local development never send real email. Playwright starts it for the tests, and `npm run stub`
// starts it for `npm run dev`.
//
// POST /emails accepts an email the way Resend does, prints it and keeps it. The exception is an
// email whose reply-to is rejected@example.com: it gets a Resend-style 422 error, so tests can check
// a failed send. GET /emails lists the accepted emails as JSON, oldest first.
//
// Usage: node scripts/resend-stub.mjs <port>
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const REJECTED = 'rejected@example.com';

const port = Number(process.argv[2]);
if (!port) throw new Error('Usage: node scripts/resend-stub.mjs <port>');

const emails = [];

createServer(async (request, response) => {
	if (request.url !== '/emails') return respond(response, 404, { message: 'Not found' });
	if (request.method === 'GET') return respond(response, 200, emails);
	if (request.method !== 'POST') return respond(response, 405, { message: 'Method not allowed' });

	let body = '';
	for await (const chunk of request) body += chunk;
	const email = JSON.parse(body);

	if (email.reply_to === REJECTED) {
		return respond(response, 422, {
			statusCode: 422,
			name: 'validation_error',
			message: `The stub refuses email with reply-to ${REJECTED}`
		});
	}

	emails.push(email);
	console.log(
		`\nFrom: ${email.from}\nTo: ${email.to}\nReply-To: ${email.reply_to}\nSubject: ${email.subject}\n\n${email.text}\n`
	);
	respond(response, 200, { id: randomUUID() });
}).listen(port, () => console.log(`Resend stub at http://localhost:${port}`));

function respond(response, status, body) {
	response.writeHead(status, { 'Content-Type': 'application/json' });
	response.end(JSON.stringify(body));
}
