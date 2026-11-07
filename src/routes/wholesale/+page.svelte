<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/Field.svelte';
	import { focusFirstError } from '#lib/focusFirstError.ts';
	import Honeypot from '#lib/Honeypot.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Wholesale · Guzzling Goat</title>
</svelte:head>

<section class="band espresso">
	<div class="wrap split">
		<div>
			<p class="eyebrow">For your business</p>
			<h1>Wholesale</h1>
			<p class="subtitle">Serve coffee that's roasted where it's grown.</p>
			<p class="lead">
				Most coffee is shipped green and roasted in the United States. Guzzling Goat is 100%
				Arabica, grown and roasted in Ethiopia, the homeland of coffee, and hand selected by a local
				expert. Your customers get a full-bodied mocha flavor with a story worth telling.
			</p>
			<a class="button" href="#inquiry">Send an inquiry</a>
		</div>
		<img
			class="photo"
			src="/photos/22-green-coffee-sacks.webp"
			alt="Sacks of Ethiopian green coffee stacked in a warehouse"
			width="960"
			height="1280"
			fetchpriority="high"
		/>
	</div>
</section>

<section class="band cream">
	<div class="wrap">
		<h2>Who we work with</h2>
		<ul class="clients">
			<li><span class="number">01</span>Cafes and coffee shops</li>
			<li><span class="number">02</span>Restaurants</li>
			<li><span class="number">03</span>Offices</li>
			<li><span class="number">04</span>Retailers</li>
		</ul>
	</div>
</section>

<section class="band">
	<div class="wrap">
		<p class="eyebrow">Why Guzzling Goat</p>
		<h2>A coffee with a story worth telling</h2>
		<ul class="reasons">
			<li>
				<img
					class="photo"
					src="/photos/27-traditional-roasting-pan.webp"
					alt="Coffee beans roasting in a traditional pan"
					width="1600"
					height="2125"
					loading="lazy"
				/>
				<h3>Roasted where it's grown</h3>
			</li>
			<li>
				<img
					class="photo"
					src="/photos/16-green-beans-glass-bowl.webp"
					alt="A glass bowl of green coffee beans"
					width="750"
					height="1000"
					loading="lazy"
				/>
				<h3>100% Arabica, hand selected</h3>
			</li>
			<li>
				<img
					class="photo"
					src="/photos/13-cupping-table.webp"
					alt="Cups and bowls of coffee set out on a table for tasting"
					width="1000"
					height="450"
					loading="lazy"
				/>
				<h3>A full-bodied mocha flavor</h3>
			</li>
		</ul>
	</div>
</section>

<section class="band espresso" id="inquiry">
	<div class="wrap split inquiry">
		<div>
			<p class="eyebrow">Send an inquiry</p>
			<h2>Let's talk</h2>
			<p class="lead">
				Tell us about your business and what you're looking for. We'll reply by email with options
				and pricing.
			</p>
		</div>
		<form method="POST" novalidate use:enhance={focusFirstError}>
			<Field
				label="Name"
				name="name"
				autocomplete="name"
				required
				value={form?.values?.name}
				error={form?.errors?.name}
			/>
			<Field
				label="Business name"
				name="business"
				autocomplete="organization"
				required
				value={form?.values?.business}
				error={form?.errors?.business}
			/>
			<Field
				label="Business type"
				name="businessType"
				required
				value={form?.values?.businessType}
				error={form?.errors?.businessType}
			/>
			<Field
				label="Email"
				name="email"
				type="email"
				autocomplete="email"
				required
				value={form?.values?.email}
				error={form?.errors?.email}
			/>
			<Field
				label="Message"
				name="message"
				multiline
				required
				value={form?.values?.message}
				error={form?.errors?.message}
			/>
			<Honeypot />
			{#if form?.sent}
				<p class="status" role="status">Thanks! We'll be in touch soon.</p>
			{:else if form?.sendFailed}
				<p class="status failed" role="alert">
					Sorry, your inquiry didn't send. Please try again.
				</p>
			{/if}
			<button>Send inquiry</button>
		</form>
	</div>
</section>

<style>
	.subtitle {
		font: 800 clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem) / 1.15 var(--font-heading);
	}

	.split .photo {
		aspect-ratio: 4 / 5;
		margin-top: 2.5rem;
	}

	.clients {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.clients li {
		padding: 1.5rem;
		border-top: 4px solid var(--brand);
		background: var(--bg);
		font: 800 1.5rem/1.2 var(--font-heading);
	}

	.number {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--brand);
		font-size: 2.75rem;
		line-height: 1;
	}

	.reasons {
		display: grid;
		gap: 2.5rem;
		margin: 2.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.reasons .photo {
		aspect-ratio: 4 / 3;
		margin-bottom: 1.25rem;
	}

	/* The form sits on a cream card, so its fields read as they would on any page. The fields fill
	   the card, and the button keeps its own width. */
	form {
		display: grid;
		gap: 1.25rem;
		margin-top: 2rem;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border-radius: 0.25rem;
		background: var(--cream);
		color: var(--text);
	}

	form button {
		justify-self: start;
	}

	.status {
		margin: 0;
		font-weight: 700;
	}

	/* Red text is 4.9:1 on the cream card. */
	.failed {
		color: var(--red);
	}

	@media (min-width: 48rem) {
		.split .photo,
		form {
			margin-top: 0;
		}

		.clients {
			grid-template-columns: repeat(4, 1fr);
		}

		.reasons {
			grid-template-columns: repeat(3, 1fr);
		}

		.inquiry {
			align-items: start;
		}
	}
</style>
