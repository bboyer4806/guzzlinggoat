<script lang="ts">
	import { enhance } from '$app/forms';
	import { sendEvent } from '#lib/analytics.ts';
	import Field from '#lib/Field.svelte';
	import { focusFirstError } from '#lib/focusFirstError.ts';
	import Honeypot from '#lib/Honeypot.svelte';

	let { form } = $props();

	// Google Analytics counts each message that sends (GGW-11).
	$effect(() => {
		if (form?.sent) sendEvent('contact_message');
	});
</script>

<section class="band">
	<div class="wrap split contact">
		<div>
			<p class="eyebrow">Say hello</p>
			<h1>Contact Us</h1>
			<p class="lead">
				We'd love to hear from you! We're here to answer your questions, listen to your suggestions,
				or help with your order.
			</p>
			<p>
				Interested in carrying Guzzling Goat at your business? Visit our
				<a href="/wholesale">Wholesale</a> page.
			</p>
			<form method="POST" novalidate use:enhance={focusFirstError}>
				<div class="names">
					<Field
						label="First name"
						name="firstName"
						autocomplete="given-name"
						required
						value={form?.values?.firstName}
						error={form?.errors?.firstName}
					/>
					<Field
						label="Last name (optional)"
						name="lastName"
						autocomplete="family-name"
						value={form?.values?.lastName}
					/>
				</div>
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
						Sorry, your message didn't send. Please try again.
					</p>
				{/if}
				<button>Send message</button>
			</form>
		</div>
		<figure>
			<img
				class="photo"
				src="/photos/26-coffee-ceremony-group.webp"
				alt="A group gathered around a traditional coffee ceremony"
				width="1080"
				height="810"
			/>
			<figcaption>Coffee is for sharing.</figcaption>
		</figure>
	</div>
</section>

<style>
	.contact {
		align-items: start;
	}

	/* The form sits on a cream card. The fields fill the card, and the button keeps its own width. */
	form {
		display: grid;
		gap: 1.25rem;
		margin-top: 2rem;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border-radius: 0.25rem;
		background: var(--cream);
	}

	form button {
		justify-self: start;
	}

	.names {
		display: grid;
		gap: 1.25rem;
	}

	.status {
		margin: 0;
		font-weight: 700;
	}

	/* Red text is 4.9:1 on the cream card. */
	.failed {
		color: var(--red);
	}

	figure {
		margin-top: 3rem;
	}

	.photo {
		aspect-ratio: 4 / 5;
	}

	figcaption {
		font: 700 1.25rem/1.2 var(--font-heading);
	}

	@media (min-width: 48rem) {
		figure {
			position: sticky;
			top: 2rem;
			margin-top: 0;
		}

		.names {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
