<script lang="ts">
	// Each pattern needs an id, unique on the page, since the band appears more than once.
	const id = $props.id();
</script>

<!-- A band of the logo badge's border: red chevrons and teal triangles between rows of cream
     squares, on espresso. -->
<svg class="pattern" aria-hidden="true" height="36">
	<defs>
		<pattern id="{id}-squares" width="22" height="11" patternUnits="userSpaceOnUse">
			<rect class="ground" width="22" height="11" />
			<rect class="square" x="4" y="2" width="7" height="7" />
			<rect class="dot" x="15" y="4" width="3" height="3" />
		</pattern>
		<pattern id="{id}-chevrons" width="24" height="14" patternUnits="userSpaceOnUse">
			<rect class="ground" width="24" height="14" />
			<path class="triangle" d="M6 14 L12 8 L18 14 Z" />
			<path class="chevron" d="M-6 2 L0 8 L6 2 L12 8 L18 2 L24 8 L30 2" />
		</pattern>
	</defs>
	<rect width="100%" height="11" fill="url(#{id}-squares)" />
	<rect y="11" width="100%" height="14" fill="url(#{id}-chevrons)" />
	<rect y="25" width="100%" height="11" fill="url(#{id}-squares)" />
</svg>

<style>
	.pattern {
		display: block;
		width: 100%;
	}

	.ground {
		fill: var(--espresso);
	}

	.square {
		fill: none;
		stroke: var(--cream);
		stroke-width: 1.75;
	}

	.dot {
		fill: var(--cream);
	}

	.triangle {
		fill: var(--teal);
	}

	.chevron {
		fill: none;
		stroke: var(--red);
		stroke-width: 2.5;
	}
</style>
