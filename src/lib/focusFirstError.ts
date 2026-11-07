import { tick } from 'svelte';
import type { SubmitFunction } from '$app/forms';

/**
 * Enhances a form (`use:enhance={focusFirstError}`) to show its action's result, then focus the
 * first field to fix. The form leaves checking to its action (novalidate), so every message shows
 * under its field in the same words. The first field to fix may be above the button the visitor
 * pressed, so this takes them to it.
 */
export const focusFirstError: SubmitFunction =
	() =>
	async ({ formElement, update }) => {
		await update();
		await tick();
		formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
	};
