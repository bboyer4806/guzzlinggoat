<svelte:head>
	<title>About mockup · Guzzling Goat</title>
</svelte:head>

<section class="section split intro">
	<div>
		<h1>About Us</h1>
		<p>
			Local Ethiopian legend tells the story of a goat farmer who was missing goats from his herd
			during the day. These goats would return with a tremendous spring in their step. After
			following these mischievous goats, he discovered that they were eating a strange bean from a
			bush. He ate the beans himself, and coffee was discovered.
		</p>
		<p>
			Guzzling Goat Coffee is made from 100% Arabica coffee grown and roasted in the homeland of
			coffee: Ethiopia. The coffee beans are hand selected by a local expert born and raised in
			Ethiopia. Unlike most other coffees, Guzzling Goat Coffee is actually roasted in Ethiopia
			using processes that have been perfected over many generations. Experience the
			energy-boosting flavor that only the homeland of coffee can provide.
		</p>
		<p class="actions">
			<a class="button" href="/wholesale">Wholesale inquiries</a>
			<a class="button secondary" href="/shop">Buy a bag</a>
		</p>
	</div>
	<img
		class="photo"
		src="/photos/14-women-at-drying-beds.webp"
		alt="Women tending coffee on raised drying beds on a green hillside"
		width="810"
		height="1080"
	/>
</section>

<section class="section gallery">
	<img
		class="photo"
		src="/photos/11-drying-beds-hillside.webp"
		alt="Coffee drying in the sun on a raised bed on a hillside"
		width="810"
		height="1080"
		loading="lazy"
	/>
	<img
		class="photo"
		src="/photos/02-hand-sorting-green-beans.webp"
		alt="A woman sorting green coffee beans by hand"
		width="810"
		height="1080"
		loading="lazy"
	/>
	<img
		class="photo"
		src="/photos/28-coffee-ceremony-pour.webp"
		alt="A woman pouring coffee at a traditional coffee ceremony"
		width="692"
		height="919"
		loading="lazy"
	/>
</section>

<style>
	h1,
	p {
		margin: 0 0 1rem;
	}

	.intro {
		padding-top: 1rem;
	}

	.intro .photo {
		aspect-ratio: 4 / 5;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.gallery .photo {
		aspect-ratio: 3 / 4;
	}

	@media (min-width: 48rem) {
		.gallery {
			gap: 1.5rem;
		}
	}
</style>
