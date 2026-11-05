<svelte:head>
	<title>Shop mockup · Guzzling Goat</title>
</svelte:head>

<section class="section split product">
	<img
		class="photo"
		src="/photos/25-bag-on-burlap.webp"
		alt="A bag of Guzzling Goat Coffee on burlap beside a bowl of roasted beans"
		width="1600"
		height="1725"
	/>
	<div>
		<h1>Guzzling Goat Whole Bean Medium Roast Ethiopian Coffee</h1>
		<p class="lead">Whole bean, medium roast, grown and roasted in Ethiopia.</p>
		<dl class="specs">
			<div><dt>Weight</dt><dd>1 lb</dd></div>
			<div><dt>Form</dt><dd>Whole bean</dd></div>
			<div><dt>Roast</dt><dd>Medium</dd></div>
			<div><dt>Flavor</dt><dd>Mocha</dd></div>
		</dl>
		<!-- A placeholder: GGW-6 swaps in the real product link. Amazon sets the price, so the page
		     shows none. -->
		<a class="button" href="https://www.amazon.com/" target="_blank">Buy on Amazon</a>
	</div>
</section>

<section class="section panel cream">
	<h2>Buying for a business?</h2>
	<p>
		Cafes, restaurants, offices and retailers can carry Guzzling Goat. Ask us about wholesale
		options and pricing.
	</p>
	<a class="button" href="/wholesale">Ask about wholesale</a>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0 0 1rem;
	}

	h1 {
		font-size: clamp(2rem, 1.5rem + 1.5vw, 2.75rem);
	}

	.product {
		padding-top: 1rem;
	}

	.photo {
		aspect-ratio: 1;
		margin-bottom: 1.5rem;
	}

	.lead {
		font-size: 1.25rem;
	}

	.specs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin: 0 0 1.5rem;
	}

	.specs div {
		padding: 0.75rem 1rem;
		border-left: 4px solid var(--brand);
		background: var(--cream);
	}

	dt {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	dd {
		margin: 0;
		font: 700 1.25rem/1.3 var(--font-heading);
	}

	@media (min-width: 48rem) {
		.photo {
			margin-bottom: 0;
		}
	}
</style>
