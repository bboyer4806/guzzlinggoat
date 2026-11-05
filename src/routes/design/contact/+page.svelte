<svelte:head>
	<title>Contact mockup · Guzzling Goat</title>
</svelte:head>

<section class="section split contact">
	<div>
		<h1>Contact Us</h1>
		<p>
			We'd love to hear from you! We're here to answer your questions, listen to your suggestions, or
			help with your order.
		</p>
		<p>
			Interested in carrying Guzzling Goat at your business? Visit our
			<a href="/wholesale">Wholesale</a> page.
		</p>
	</div>
	<!-- A mockup: submitting does nothing. GGW-8 adds the form action. -->
	<form class="panel cream" onsubmit={(event) => event.preventDefault()}>
		<div class="names">
			<label>First name <input name="firstName" autocomplete="given-name" required /></label>
			<label>Last name (optional) <input name="lastName" autocomplete="family-name" /></label>
		</div>
		<label>Email <input type="email" name="email" autocomplete="email" required /></label>
		<label>Message <textarea name="message" required></textarea></label>
		<button>Send message</button>
	</form>
</section>

<style>
	h1,
	p {
		margin: 0 0 1rem;
	}

	.contact {
		padding-top: 1rem;
		align-items: start;
	}

	form {
		display: grid;
		gap: 1rem;
		justify-items: start;
		margin-top: 1rem;
	}

	form label,
	.names {
		justify-self: stretch;
	}

	.names {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 48rem) {
		form {
			margin-top: 0;
		}

		.names {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
