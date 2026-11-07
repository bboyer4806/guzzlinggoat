<script lang="ts">
	import CallsToAction from '#lib/CallsToAction.svelte';
	import Legend from '#lib/Legend.svelte';
</script>

<!-- The hero fills the screen with a photo, with the headline and the calls to action over it. -->
<section class="band hero">
	<img
		class="photo"
		src="/photos/27-traditional-roasting-pan.webp"
		srcset="
			/photos/27-traditional-roasting-pan.webp 1600w,
			/photos/27-traditional-roasting-pan-large.webp 1940w
		"
		sizes="100vw"
		alt="Coffee beans roasting in a traditional pan"
		width="1600"
		height="2125"
		fetchpriority="high"
	/>
	<div class="wrap">
		<p class="eyebrow">Grown and roasted in Ethiopia</p>
		<h1>Experience Pure Ethiopian Coffee</h1>
		<CallsToAction />
	</div>
</section>

<section class="band intro">
	<div class="wrap">
		<p class="eyebrow">Where coffee began</p>
		<p class="statement">
			Ethiopians first discovered and brewed coffee over a millennium ago. Our coffee was grown and
			roasted by those descendants.
		</p>
		<ul class="squares">
			<li>100% Arabica</li>
			<li>Hand selected</li>
			<li>Roasted in Ethiopia</li>
			<li>Mocha flavor</li>
		</ul>
	</div>
</section>

<section class="band cream">
	<div class="wrap">
		<p class="eyebrow">Our coffee</p>
		<h2>From the hillside to your cup</h2>
		<ol class="steps">
			<li>
				<img
					class="photo"
					src="/photos/11-drying-beds-hillside.webp"
					alt="Coffee drying in the sun on a raised bed on a hillside"
					width="810"
					height="1080"
					loading="lazy"
				/>
				<span class="number">01</span>
				<h3>Grown in the homeland of coffee</h3>
				<p>100% Arabica coffee, grown in Ethiopia.</p>
			</li>
			<li>
				<img
					class="photo"
					src="/photos/02-hand-sorting-green-beans.webp"
					alt="A woman sorting green coffee beans by hand"
					width="810"
					height="1080"
					loading="lazy"
				/>
				<span class="number">02</span>
				<h3>Hand selected</h3>
				<p>The coffee beans are hand selected by a local expert born and raised in Ethiopia.</p>
			</li>
			<li>
				<img
					class="photo"
					src="/photos/03-roasted-beans-bowl.webp"
					alt="A bowl of freshly roasted coffee beans"
					width="810"
					height="800"
					loading="lazy"
				/>
				<span class="number">03</span>
				<h3>Roasted at the source</h3>
				<p>
					Most coffee beans are simply imported from other countries and then roasted in the United
					States. Our coffee is roasted at the source.
				</p>
			</li>
		</ol>
	</div>
</section>

<section class="band">
	<div class="wrap split">
		<img
			class="photo"
			src="/photos/04-roasted-beans-palm.webp"
			alt="Roasted coffee beans in an open hand"
			width="810"
			height="1080"
			loading="lazy"
		/>
		<div>
			<p class="eyebrow">Tasting notes</p>
			<h2>Powerfully Unique Flavor</h2>
			<p class="lead">
				Our coffee packs a powerful, full-bodied Arabica mocha flavor with a distinct, fragrant
				aroma.
			</p>
			<ul class="tags">
				<li>Mocha</li>
				<li>Full-bodied</li>
				<li>Fragrant aroma</li>
			</ul>
		</div>
	</div>
</section>

<section class="band espresso">
	<div class="wrap split">
		<img
			class="photo"
			src="/photos/05-cargo-loading-boxes.webp"
			alt="A worker loading boxes onto a conveyor in a cargo warehouse"
			width="960"
			height="1280"
			loading="lazy"
		/>
		<div>
			<p class="eyebrow">Wholesale</p>
			<h2>Serve coffee that's roasted where it's grown.</h2>
			<p class="lead">
				Tell us about your business and what you're looking for. We'll reply by email with options
				and pricing.
			</p>
			<ul class="squares" aria-label="Who we work with">
				<li>Cafes and coffee shops</li>
				<li>Restaurants</li>
				<li>Offices</li>
				<li>Retailers</li>
			</ul>
			<a class="button" href="/wholesale">Start a wholesale inquiry</a>
		</div>
	</div>
</section>

<section class="band cream">
	<div class="wrap split">
		<div>
			<p class="eyebrow">How coffee was discovered</p>
			<h2>Discover the Legend</h2>
			<Legend />
		</div>
		<img
			class="photo"
			src="/photos/28-coffee-ceremony-pour.webp"
			alt="A woman pouring coffee at a traditional coffee ceremony"
			width="692"
			height="919"
			loading="lazy"
		/>
	</div>
</section>

<section class="band">
	<div class="wrap split">
		<img
			class="photo"
			src="/photos/25-bag-on-burlap.webp"
			srcset="
				/photos/25-bag-on-burlap.webp 1600w,
				/photos/25-bag-on-burlap-large.webp 2390w
			"
			sizes="(min-width: 48rem) 50vw, 100vw"
			alt="A bag of Guzzling Goat Coffee on burlap beside a bowl of roasted beans"
			width="1600"
			height="1725"
			loading="lazy"
		/>
		<div>
			<p class="eyebrow">Bring it home</p>
			<h2>Whole bean, medium roast, grown and roasted in Ethiopia.</h2>
			<ul class="tags">
				<li>1 lb</li>
				<li>Whole bean</li>
				<li>Medium roast</li>
				<li>Mocha</li>
			</ul>
			<a class="button" href="/shop">Buy a bag</a>
		</div>
	</div>
</section>

<style>
	/* The photo fills the hero, darkened at the bottom so the white text over it stays readable. */
	.hero {
		position: relative;
		display: grid;
		align-content: end;
		min-height: clamp(26rem, 70svh, 52rem);
		padding-block: 2.5rem;
		color: var(--bg);
		isolation: isolate;
	}

	.hero .photo {
		position: absolute;
		inset: 0;
		z-index: -2;
		height: 100%;
		object-position: 50% 60%;
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(to top, color-mix(in srgb, var(--espresso) 90%, transparent) 20%, transparent 80%),
			linear-gradient(to right, color-mix(in srgb, var(--espresso) 60%, transparent), transparent 70%);
	}

	.hero .wrap {
		width: 100%;
	}

	.hero h1 {
		max-width: 14ch;
	}

	.intro {
		text-align: center;
	}

	.intro .eyebrow,
	.intro .squares {
		justify-content: center;
	}

	.statement {
		max-width: 26ch;
		margin: 0 auto 2.5rem;
		font: 700 clamp(1.75rem, 1.1rem + 2.6vw, 3.25rem) / 1.15 var(--font-heading);
	}

	.steps {
		display: grid;
		gap: 3rem;
		margin: 2.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.steps .photo {
		aspect-ratio: 4 / 5;
		margin-bottom: 1.25rem;
	}

	.number {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--brand);
		font: 800 2.75rem/1 var(--font-heading);
	}

	.split .photo {
		aspect-ratio: 4 / 5;
		margin-bottom: 2rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 2rem;
		padding: 0;
		list-style: none;
	}

	.tags li {
		padding: 0.375rem 0.875rem;
		border: 2px solid var(--brand);
		border-radius: 999px;
		font-weight: 600;
	}

	@media (min-width: 48rem) {
		.steps {
			grid-template-columns: repeat(3, 1fr);
		}

		.split .photo {
			margin-bottom: 0;
		}
	}
</style>
