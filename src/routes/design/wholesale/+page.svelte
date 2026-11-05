<svelte:head>
	<title>Wholesale mockup · Guzzling Goat</title>
</svelte:head>

<section class="section split intro">
	<div>
		<h1>Wholesale</h1>
		<p class="subtitle">Serve coffee that's roasted where it's grown.</p>
		<p>
			Most coffee is shipped green and roasted in the United States. Guzzling Goat is 100% Arabica,
			grown and roasted in Ethiopia, the homeland of coffee, and hand selected by a local expert.
			Your customers get a full-bodied mocha flavor with a story worth telling.
		</p>
		<a class="button" href="#inquiry">Send an inquiry</a>
	</div>
	<img
		class="photo"
		src="/photos/22-green-coffee-sacks.webp"
		alt="Sacks of Ethiopian green coffee stacked in a warehouse"
		width="960"
		height="1280"
	/>
</section>

<section class="section">
	<h2>Who we work with</h2>
	<ul class="clients">
		<li>Cafes and coffee shops</li>
		<li>Restaurants</li>
		<li>Offices</li>
		<li>Retailers</li>
	</ul>
</section>

<section class="section panel cream split inquiry" id="inquiry">
	<div>
		<h2>Let's talk</h2>
		<p>
			Tell us about your business and what you're looking for. We'll reply by email with options
			and pricing.
		</p>
	</div>
	<!-- A mockup: submitting does nothing. GGW-7 adds the form action. -->
	<form onsubmit={(event) => event.preventDefault()}>
		<label>Name <input name="name" autocomplete="name" required /></label>
		<label>Business name <input name="business" autocomplete="organization" required /></label>
		<label>Business type <input name="businessType" required /></label>
		<label>Email <input type="email" name="email" autocomplete="email" required /></label>
		<label>Message <textarea name="message" required></textarea></label>
		<button>Send inquiry</button>
	</form>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0 0 1rem;
	}

	.intro {
		padding-top: 1rem;
	}

	.intro .photo {
		aspect-ratio: 1;
		margin-top: 1.5rem;
	}

	.subtitle {
		font: 800 1.5rem/1.2 var(--font-heading);
	}

	.clients {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.clients li {
		padding: 1rem;
		border-left: 4px solid var(--brand);
		background: var(--cream);
		font: 700 1.25rem/1.2 var(--font-heading);
	}

	form {
		display: grid;
		gap: 1rem;
		justify-items: start;
	}

	form label {
		justify-self: stretch;
	}

	@media (min-width: 48rem) {
		.intro .photo {
			margin-top: 0;
		}

		.clients {
			grid-template-columns: repeat(4, 1fr);
		}

		.inquiry {
			align-items: start;
		}
	}
</style>
