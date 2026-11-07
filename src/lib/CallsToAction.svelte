<script lang="ts">
	// Centered under centered text, as on About; otherwise from the left, as in the Home hero.
	let { centered = false }: { centered?: boolean } = $props();
</script>

<!-- The Wholesale and Buy calls to action. Wholesale comes first, as the filled button, since
     wholesale is the site's main goal. -->
<p class="actions" class:centered>
	<a class="button" href="/wholesale">Wholesale inquiries</a>
	<a class="button secondary" href="/shop">Buy a bag</a>
</p>

<style>
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 0;
	}

	.centered {
		justify-content: center;
	}
</style>
