<svelte:head>
	<title>Contact mockup · Guzzling Goat</title>
</svelte:head>

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
			<!-- A mockup: submitting does nothing. GGW-8 adds the form action. -->
			<form onsubmit={(event) => event.preventDefault()}>
				<div class="names">
					<label>First name <input name="firstName" autocomplete="given-name" required /></label>
					<label>Last name (optional) <input name="lastName" autocomplete="family-name" /></label>
				</div>
				<label>Email <input type="email" name="email" autocomplete="email" required /></label>
				<label>Message <textarea name="message" required></textarea></label>
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

	form {
		display: grid;
		gap: 1.25rem;
		justify-items: start;
		margin-top: 2rem;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border-radius: 0.25rem;
		background: var(--cream);
	}

	form label,
	.names {
		justify-self: stretch;
	}

	.names {
		display: grid;
		gap: 1.25rem;
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
