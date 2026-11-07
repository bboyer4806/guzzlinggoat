<script lang="ts">
	import { sendEvent } from '#lib/analytics.ts';
</script>

<section class="band">
	<div class="wrap split product">
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
			fetchpriority="high"
		/>
		<div>
			<p class="eyebrow">Whole bean coffee</p>
			<h1>Guzzling Goat Whole Bean Medium Roast Ethiopian Coffee</h1>
			<p class="lead">Whole bean, medium roast, grown and roasted in Ethiopia.</p>
			<dl class="specs">
				<div><dt>Weight</dt><dd>1 lb</dd></div>
				<div><dt>Form</dt><dd>Whole bean</dd></div>
				<div><dt>Roast</dt><dd>Medium</dd></div>
				<div><dt>Flavor</dt><dd>Mocha</dd></div>
			</dl>
			<!-- Amazon sets the price, so the page shows none. Keep the link exactly as it is: its maas
			     tag credits the sale to the site through Amazon Attribution. -->
			<a
				class="button buy"
				href="https://www.amazon.com/Guzzling-Goat-Ethiopian-Coffee-Flavorful/dp/B0FBBL6K55/?maas=maas_adg_22B6465B489CF19BB0B02DBC2920D706_afap_abs&ref_=aa_maas&tag=maas"
				target="_blank"
				onclick={() => sendEvent('amazon_click')}>Buy on Amazon</a
			>
			<p class="note">Buying for a business? <a href="/wholesale">Ask about wholesale</a></p>
		</div>
	</div>
</section>

<section class="band cream">
	<div class="wrap split">
		<div>
			<p class="eyebrow">What's in the bag</p>
			<h2>Grown, hand selected and roasted in Ethiopia.</h2>
			<ul class="squares">
				<li>100% Arabica</li>
				<li>Hand selected</li>
				<li>Roasted at the source</li>
				<li>Mocha flavor</li>
			</ul>
			<a class="button secondary" href="/about">Read our story</a>
		</div>
		<img
			class="photo"
			src="/photos/24-bag-back.webp"
			alt="The back of a Guzzling Goat Coffee bag"
			width="1600"
			height="2398"
			loading="lazy"
		/>
	</div>
</section>

<section class="band espresso">
	<div class="wrap split">
		<div>
			<p class="eyebrow">Wholesale</p>
			<h2>Buying for a business?</h2>
		</div>
		<div>
			<p class="lead">
				Cafes, restaurants, offices and retailers can carry Guzzling Goat. Ask us about wholesale
				options and pricing.
			</p>
			<a class="button" href="/wholesale">Ask about wholesale</a>
		</div>
	</div>
</section>

<style>
	h1 {
		font-size: clamp(2rem, 1.4rem + 2.4vw, 3.25rem);
	}

	.product .photo {
		margin-bottom: 2rem;
	}

	.specs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		margin: 1.5rem 0 2rem;
		border: 1px solid var(--espresso);
		background: var(--espresso);
	}

	.specs div {
		padding: 1rem 1.25rem;
		background: var(--bg);
	}

	dt {
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	dd {
		margin: 0.25rem 0 0;
		font: 800 1.5rem/1.2 var(--font-heading);
	}

	.buy {
		width: 100%;
	}

	.note {
		margin: 1rem 0 0;
	}

	.cream .photo {
		aspect-ratio: 4 / 5;
		margin-top: 2rem;
		object-position: 50% 20%;
	}

	@media (min-width: 48rem) {
		.product .photo,
		.cream .photo {
			margin: 0;
		}

		.buy {
			width: auto;
		}
	}
</style>
