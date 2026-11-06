<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';

	interface Props {
		label: string;
		name: string;
		/**
		 * What the visitor typed, which the form's action sends back when it doesn't go through. Left
		 * undefined before that, so the page doesn't wipe what they type while it's still loading.
		 */
		value?: string;
		/** The action's message saying what to fix (src/lib/server/forms.ts). */
		error?: string;
		type?: 'text' | 'email';
		autocomplete?: FullAutoFill;
		required?: boolean;
		/** A textarea, for longer text such as a message. */
		multiline?: boolean;
	}

	let {
		label,
		name,
		value,
		error,
		type = 'text',
		autocomplete,
		required = false,
		multiline = false
	}: Props = $props();

	// Ties the message to the field, so a screen reader reads it with the label.
	const errorId = $derived(error ? `${name}-error` : undefined);
</script>

<!-- The message sits outside the label, so it isn't read as part of the field's name. -->
<div>
	<label>
		{label}
		{#if multiline}
			<textarea
				{name}
				{required}
				{value}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={errorId}
			></textarea>
		{:else}
			<input
				{name}
				{type}
				{autocomplete}
				{required}
				{value}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={errorId}
			/>
		{/if}
	</label>
	{#if error}
		<p id={errorId}>{error}</p>
	{/if}
</div>

<style>
	[aria-invalid='true'] {
		border-color: var(--red);
	}

	/* Red text is 4.9:1 on the cream form cards and 5.6:1 on white. */
	p {
		margin: 0.375rem 0 0;
		color: var(--red);
		font-weight: 600;
	}
</style>
