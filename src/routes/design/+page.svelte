<script lang="ts">
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
			use: 'Dark sections, with white text. From the logo badge.'
		},
		{
			name: 'Cream',
			hex: '#F6EFE1',
			variable: '--cream',
			use: 'Light sections and form panels. The gold at 12% on white.'
		},
		{ name: 'Red', hex: '#CB211E', variable: '--error', use: 'Form errors. From the logo badge.' }
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

<section class="section">
	<h1>Design</h1>
	<p>
		The palette, type and page mockups for the new site. The mockups use the site's header, nav and
		footer, and their forms send nothing.
	</p>
</section>

<section class="section">
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
</section>

<section class="section">
	<h2>Type</h2>
	<div class="split">
		<div>
			<p class="font-name">Headings: Rokkitt</p>
			<p class="sample-heading">Experience Pure Ethiopian Coffee</p>
		</div>
		<div>
			<p class="font-name">Body: Source Sans 3</p>
			<p>
				Ethiopians first discovered and brewed coffee over a millennium ago. Our coffee was grown
				and roasted by those descendants. It packs a powerful, full-bodied Arabica mocha flavor
				with a distinct, fragrant aroma.
			</p>
		</div>
	</div>
</section>

<section class="section">
	<h2 id="mockups">Mockups</h2>
	<ul class="mockups" aria-labelledby="mockups">
		{#each mockups as { href, label } (href)}
			<li><a class="button secondary" {href}>{label}</a></li>
		{/each}
	</ul>
</section>

<style>
	h1,
	h2 {
		margin: 1rem 0;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.palette {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1.5rem 1rem;
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

	.split {
		align-items: start;
	}

	.font-name {
		margin: 0;
		font-weight: 700;
	}

	.sample-heading {
		margin: 0.5rem 0 1rem;
		font: 800 2.5rem/1.1 var(--font-heading);
	}

	.mockups {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
</style>
