<script lang="ts">
	import Pattern from '#lib/Pattern.svelte';

	// The hex values repeat src/app.css so the page can print them. The design tests check that each
	// swatch shows the color its hex value names.
	const colors = [
		{ name: 'Gold', hex: '#B37602', variable: '--brand', use: 'Links and buttons (GGW-1)' },
		{ name: 'Black', hex: '#000000', variable: '--text', use: 'Text (GGW-1)' },
		{ name: 'White', hex: '#FFFFFF', variable: '--bg', use: 'Page background (GGW-1)' },
		{
			name: 'Espresso',
			hex: '#241007',
			variable: '--espresso',
			use: 'Dark bands and the footer, with white text. From the logo badge.'
		},
		{
			name: 'Cream',
			hex: '#F6EFE1',
			variable: '--cream',
			use: 'Light bands and form cards. The gold at 12% on white.'
		},
		{
			name: 'Red',
			hex: '#CB211E',
			variable: '--red',
			use: 'Form errors and the badge pattern. From the logo badge.'
		},
		{
			name: 'Teal',
			hex: '#1CC8AC',
			variable: '--teal',
			use: 'The badge pattern only, never text. From the logo badge.'
		}
	];

	const mockups = [
		{ href: '/design/home', label: 'Home' },
		{ href: '/design/about', label: 'About' },
		{ href: '/design/shop', label: 'Shop' },
		{ href: '/design/wholesale', label: 'Wholesale' },
		{ href: '/design/contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<title>Design · Guzzling Goat</title>
</svelte:head>

<section class="band">
	<div class="wrap">
		<p class="eyebrow">For approval</p>
		<h1>Design</h1>
		<p class="lead">
			The palette, type and page mockups for the new site. The mockups use the site's header, nav
			and footer, and their forms send nothing.
		</p>
		<div class="mockups">
			<p id="mockups" class="label">Mockups</p>
			<ul aria-labelledby="mockups">
				{#each mockups as { href, label } (href)}
					<li><a class="button secondary" {href}>{label}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section class="band cream">
	<div class="wrap">
		<h2 id="palette">Palette</h2>
		<ul class="palette" aria-labelledby="palette">
			{#each colors as { name, hex, variable, use } (variable)}
				<li>
					<span class="swatch" style="background: var({variable})"></span>
					<strong>{name}</strong>
					<code>{hex}</code>
					<code>{variable}</code>
					<span>{use}</span>
				</li>
			{/each}
		</ul>
		<h3>The badge pattern</h3>
		<p>Taken from the logo badge's border. It runs under the header and over the footer.</p>
		<Pattern />
	</div>
</section>

<section class="band">
	<div class="wrap">
		<h2>Type</h2>
		<div class="split fonts">
			<div>
				<p class="font-name">Headings: Rokkitt</p>
				<p class="sample-heading">Experience Pure Ethiopian Coffee</p>
			</div>
			<div>
				<p class="font-name">Body: Source Sans 3</p>
				<p class="eyebrow">Labels: Source Sans 3, capitals</p>
				<p>
					Ethiopians first discovered and brewed coffee over a millennium ago. Our coffee was grown
					and roasted by those descendants. It packs a powerful, full-bodied Arabica mocha flavor
					with a distinct, fragrant aroma.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mockups,
	.mockups ul {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.mockups {
		margin-top: 2rem;
	}

	.label {
		margin: 0 0.5rem 0 0;
		font-weight: 700;
	}

	.palette {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1.5rem 1rem;
		margin-bottom: 3rem;
	}

	.palette li {
		display: flex;
		flex-direction: column;
	}

	.swatch {
		height: 6rem;
		margin-bottom: 0.5rem;
		border: 1px solid var(--text);
		border-radius: 0.25rem;
	}

	.fonts {
		align-items: start;
	}

	.font-name {
		font-weight: 700;
	}

	.sample-heading {
		font: 800 clamp(2.5rem, 1.6rem + 4vw, 4.75rem) / 1.05 var(--font-heading);
	}
</style>
