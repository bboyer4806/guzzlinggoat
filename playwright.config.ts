import { defineConfig } from '@playwright/test';

const port = 4173;
// Not npm run stub's port, so the tests can run while it's up.
const stubPort = 4011;

// The app and the email tests send form email to the local Resend stub with a placeholder key,
// never to Resend. The web servers and the test workers inherit these.
process.env.RESEND_BASE_URL = `http://localhost:${stubPort}`;
process.env.RESEND_API_KEY = 'stub';

// Runs the tests against the production build. Each test file sets the window sizes it needs.
export default defineConfig({
	testDir: 'tests/e2e',
	testMatch: '**/*.e2e.ts',
	fullyParallel: true,
	// CLAUDECODE is set in Claude Code's shell; dot keeps passing tests out of its context.
	reporter: process.env.CI ? 'github' : process.env.CLAUDECODE ? 'dot' : 'list',
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'retain-on-failure',
		// Lets a machine with a different preinstalled Chromium run the tests.
		launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH }
	},
	webServer: [
		{
			command: `node scripts/resend-stub.mjs ${stubPort}`,
			url: `http://localhost:${stubPort}/emails`,
			reuseExistingServer: false
		},
		{
			command: `npm run build && npx vite preview --port ${port} --strictPort`,
			url: `http://localhost:${port}/healthz`,
			reuseExistingServer: false,
			timeout: 180_000
		}
	]
});
