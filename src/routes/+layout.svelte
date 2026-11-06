<script lang="ts">
	import '@fontsource-variable/rokkitt';
	import '@fontsource-variable/source-sans-3';
	import '../app.css';
	import { page } from '$app/state';
	import Pattern from '#lib/Pattern.svelte';

	let { children } = $props();

	// Wholesale comes last, as the header's button, since wholesale is the site's main goal.
	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/shop', label: 'Shop' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/wholesale', label: 'Wholesale' }
	];
</script>

<p class="announce">
	Grown and roasted in Ethiopia <span aria-hidden="true">·</span>
	<a href="/wholesale">Ask about wholesale</a>
</p>

<header>
	<a class="logo" href="/">
		<img src="/logo-badge.png" alt="Guzzling Goat Coffee" width="518" height="628" />
	</a>
	<nav>
		<ul>
			{#each links as { href, label } (href)}
				<li>
					<a
						{href}
						class:cta={href === '/wholesale'}
						aria-current={page.url.pathname === href ? 'page' : undefined}>{label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>
<Pattern />

<main>
	{@render children()}
</main>

<footer>
	<Pattern />
	<div class="columns">
		<div>
			<p class="statement">Roasted where it's grown.</p>
			<p>100% Arabica coffee, grown and roasted in Ethiopia, the homeland of coffee.</p>
		</div>
		<div>
			<p class="eyebrow">Wholesale</p>
			<p>For cafes, restaurants, offices and retailers.</p>
			<a class="button" href="/wholesale">Wholesale inquiries</a>
		</div>
		<nav aria-label="Footer">
			<p class="eyebrow">Explore</p>
			<ul>
				{#each links as { href, label } (href)}
					<li><a {href}>{label}</a></li>
				{/each}
			</ul>
		</nav>
	</div>
	<p class="copyright">© {new Date().getFullYear()} Guzzling Goat</p>
</footer>

<style>
	.announce {
		margin: 0;
		padding: 0.5rem var(--gutter);
		background: var(--espresso);
		color: var(--cream);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-align: center;
	}

	/* The nav sits beside the logo and wraps onto a second row on a phone, so every link stays on
	   screen without a menu or sideways scrolling. The logo keeps GGW-1's white background. */
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem var(--gutter);
		background: var(--bg);
	}

	/* Tall enough for the badge's lettering to stay readable on a phone. */
	.logo img {
		display: block;
		height: clamp(4.5rem, 3.5rem + 3vw, 6.5rem);
		width: auto;
	}

	header ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* At least 44px tall, so each link is easy to tap. */
	header nav a {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 0.5rem;
		font-size: 0.9375rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-decoration: none;
		text-transform: uppercase;
	}

	header nav a:hover,
	header nav a[aria-current='page'] {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.35em;
	}

	header nav a.cta {
		padding: 0 0.875rem;
		border-radius: 0.25rem;
		background: var(--brand);
		color: var(--text);
	}

	main {
		padding-inline: var(--gutter);
	}

	footer {
		background: var(--espresso);
		color: var(--bg);
	}

	.columns {
		display: grid;
		gap: 2.5rem;
		max-width: 80rem;
		margin-inline: auto;
		padding: clamp(3rem, 7vw, 5rem) var(--gutter) 2rem;
	}

	.statement {
		font: 800 clamp(2rem, 1.5rem + 2vw, 3rem) / 1.05 var(--font-heading);
	}

	footer ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	footer nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-weight: 600;
	}

	.copyright {
		margin: 0;
		padding: 1.5rem var(--gutter);
		border-top: 1px solid var(--brand);
		font-size: 0.875rem;
		text-align: center;
	}

	@media (min-width: 48rem) {
		.columns {
			grid-template-columns: 2fr 1fr 1fr;
		}
	}
</style>
