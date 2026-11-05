<script lang="ts">
	import '@fontsource-variable/rokkitt';
	import '@fontsource-variable/source-sans-3';
	import '../app.css';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/shop', label: 'Shop' },
		{ href: '/wholesale', label: 'Wholesale' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<header>
	<a class="logo" href="/">
		<img src="/logo-badge.png" alt="Guzzling Goat Coffee" width="518" height="628" />
	</a>
	<nav>
		<ul>
			{#each links as { href, label } (href)}
				<li><a {href}>{label}</a></li>
			{/each}
		</ul>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p>© {new Date().getFullYear()} Guzzling Goat</p>
</footer>

<style>
	/* The nav sits beside the logo when there's room and wraps below it when there isn't, so every
	   link stays on screen without a menu or sideways scrolling. */
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1rem;
		padding: 1rem;
		background: var(--bg);
	}

	/* Tall enough for the badge's lettering to stay readable on a phone. */
	.logo img {
		display: block;
		height: 7rem;
		width: auto;
	}

	/* The negative margin lines the links' text up with the logo and the page edge. */
	ul {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -0.75rem;
		padding: 0;
		list-style: none;
	}

	/* At least 44px tall, so each link is easy to tap. */
	nav a {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 0.75rem;
		font-weight: 600;
		text-decoration: none;
	}

	nav a:hover {
		text-decoration: underline;
	}

	main,
	footer {
		padding: 0 1rem;
	}
</style>
