<script lang="ts">
	import CallsToAction from '#lib/CallsToAction.svelte';
	import Legend from '#lib/Legend.svelte';
</script>

<section class="band cream">
	<div class="wrap split">
		<div>
			<p class="eyebrow">Our story</p>
			<h1>About Us</h1>
			<Legend />
			<p>
				Guzzling Goat Coffee is made from 100% Arabica coffee grown and roasted in the homeland of
				coffee: Ethiopia. The coffee beans are hand selected by a local expert born and raised in
				Ethiopia. Unlike most other coffees, Guzzling Goat Coffee is actually roasted in Ethiopia
				using processes that have been perfected over many generations. Experience the
				energy-boosting flavor that only the homeland of coffee can provide.
			</p>
		</div>
		<img
			class="photo"
			src="/photos/14-women-at-drying-beds.webp"
			alt="Women tending coffee on raised drying beds on a green hillside"
			width="810"
			height="1080"
			fetchpriority="high"
		/>
	</div>
</section>

<!-- Three photos side by side fill the width of a wide screen, and each is shown no wider than a
     third of it, so none is stretched far past its size. On a phone they stack. -->
<div class="band strip">
	<figure>
		<img
			class="photo"
			src="/photos/17-drying-beds-rows.webp"
			alt="Rows of raised drying beds on a hillside"
			width="1080"
			height="810"
			loading="lazy"
		/>
		<figcaption>Drying beds in the hills</figcaption>
	</figure>
	<figure>
		<img
			class="photo"
			src="/photos/01-green-beans-in-hands.webp"
			alt="Two hands holding green coffee beans over a sack"
			width="810"
			height="1080"
			loading="lazy"
		/>
		<figcaption>Green coffee, before roasting</figcaption>
	</figure>
	<figure>
		<img
			class="photo"
			src="/photos/21-green-beans-drying-station.webp"
			alt="Green coffee beans spread out at a drying station"
			width="1080"
			height="719"
			loading="lazy"
		/>
		<figcaption>Drying in the sun</figcaption>
	</figure>
</div>

<section class="band espresso closing">
	<div class="wrap">
		<p class="quote">Experience the energy-boosting flavor that only the homeland of coffee can provide.</p>
		<CallsToAction centered />
	</div>
</section>

<style>
	.split .photo {
		aspect-ratio: 4 / 5;
		margin-top: 1rem;
	}

	.strip {
		display: grid;
		padding: 0;
	}

	.strip figure {
		position: relative;
	}

	.strip .photo {
		aspect-ratio: 4 / 5;
	}

	/* The caption sits on the photo, over a dark fade so it stays readable. */
	.strip figcaption {
		position: absolute;
		inset: auto 0 0;
		margin: 0;
		padding: 3rem var(--gutter) 1.25rem;
		background: linear-gradient(to top, color-mix(in srgb, var(--espresso) 85%, transparent), transparent);
		color: var(--bg);
		font: 700 1.25rem/1.2 var(--font-heading);
	}

	.closing {
		text-align: center;
	}

	.quote {
		max-width: 26ch;
		margin: 0 auto 2.5rem;
		font: 800 clamp(1.75rem, 1.1rem + 2.6vw, 3.25rem) / 1.15 var(--font-heading);
	}

	.quote::before {
		content: '“';
		display: block;
		color: var(--brand);
		font-size: 2em;
		line-height: 0.6;
	}

	@media (min-width: 48rem) {
		.split .photo {
			margin-top: 0;
		}

		.strip {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
