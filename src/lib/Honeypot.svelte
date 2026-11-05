<script module lang="ts">
	/** The field's name. A form's action passes its value to sendSubmission (#lib/server/email). */
	export const HONEYPOT_FIELD = 'website';
</script>

<!-- Hidden from people, and from autofill, which skips hidden fields, so only bots fill it in.
     sendSubmission drops a submission that has it filled in. -->
<div class="honeypot">
	<label>
		Website
		<input name={HONEYPOT_FIELD} autocomplete="off" />
	</label>
</div>

<style>
	.honeypot {
		display: none;
	}
</style>
