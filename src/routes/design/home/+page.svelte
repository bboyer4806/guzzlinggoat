<svelte:head>
	<title>Home mockup · Guzzling Goat</title>
</svelte:head>

<!-- Wholesale comes first and is the filled button, since wholesale is the site's main goal. -->
<section class="section split hero">
	<div>
		<h1>Experience Pure Ethiopian Coffee</h1>
		<p class="lead">100% Arabica coffee grown and roasted in Ethiopia, the homeland of coffee.</p>
		<p class="actions">
			<a class="button" href="/wholesale">Wholesale inquiries</a>
			<a class="button secondary" href="/shop">Buy a bag</a>
		</p>
	</div>
	<img
		class="photo"
		src="/photos/25-bag-on-burlap.webp"
		alt="A bag of Guzzling Goat Coffee on burlap beside a bowl of roasted beans"
		width="1600"
		height="1725"
	/>
</section>

<section class="section panel cream split">
	<div>
		<h2>Powerfully Unique Flavor</h2>
		<p>
			Ethiopians first discovered and brewed coffee over a millennium ago. Our coffee was grown and
			roasted by those descendants.
		</p>
		<p>
			Most coffee beans are simply imported from other countries and then roasted in the United
			States. Our coffee is roasted at the source.
		</p>
		<p>
			Our coffee packs a powerful, full-bodied Arabica mocha flavor with a distinct, fragrant
			aroma.
		</p>
	</div>
	<img
		class="photo"
		src="/photos/04-roasted-beans-palm.webp"
		alt="Roasted coffee beans in an open hand"
		width="810"
		height="1080"
		loading="lazy"
	/>
</section>

<section class="section panel espresso split">
	<div>
		<h2>Serve coffee that's roasted where it's grown.</h2>
		<p>
			Guzzling Goat is 100% Arabica, grown and roasted in Ethiopia and hand selected by a local
			expert. Tell us about your business and we'll reply with options and pricing.
		</p>
		<a class="button" href="/wholesale">Start a wholesale inquiry</a>
	</div>
	<ul class="clients" aria-label="Who we work with">
		<li>Cafes and coffee shops</li>
		<li>Restaurants</li>
		<li>Offices</li>
		<li>Retailers</li>
	</ul>
</section>

<section class="section split">
	<div>
		<h2>Discover the Legend</h2>
		<p>
			Local Ethiopian legend tells the story of a goat farmer who was missing goats from his herd
			during the day. These goats would return with a tremendous spring in their step. After
			following these mischievous goats, he discovered that they were eating a strange bean from a
			bush. He ate the beans himself, and coffee was discovered.
		</p>
	</div>
	<img
		class="photo"
		src="/photos/27-traditional-roasting-pan.webp"
		alt="Coffee beans roasting in a traditional pan"
		width="1600"
		height="2125"
		loading="lazy"
	/>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0 0 1rem;
	}

	.photo {
		aspect-ratio: 1;
	}

	.hero {
		padding-top: 1rem;
	}

	.lead {
		font-size: 1.25rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.clients {
		display: grid;
		gap: 0.75rem;
		margin: 2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.clients li {
		padding: 0.75rem 1rem;
		border-left: 4px solid var(--brand);
		font: 700 1.25rem/1.2 var(--font-heading);
	}

	@media (min-width: 48rem) {
		/* Alternates the photo's side. On a phone, every photo follows its text. */
		.cream .photo {
			order: -1;
		}

		.clients {
			margin: 0;
		}
	}
</style>
