<script>
	import { onMount } from 'svelte';

	/**
	 * @type {import("./index").FormField}
	 */
	export let formField;

	/**
	 * @type {string}
	 */
	export let id;

	/**
	 * @type {string}
	 */
	export let label;

	/**
	 * @type {string}
	 */
	export let type = 'text';

	/**
	 * @type {string | null}
	 */
	export let successMessage = null;

	onMount(() => {
		formField.validate();
	});
</script>

<label for={id}>{@html label}</label>

<input
	{type}
	{id}
	on:focusout={(e) => (formField.onFocusOut = e)}
	on:input={(e) => (formField.onInput = e)}
	class:is-invalid={formField.touched && !formField.valid}
	class:is-valid={formField.touched && formField.valid}
	{...$$restProps}
/>

{#if formField.touched && !formField.valid}
	<div class="invalid-feedback">
		{#if formField.error}
			{formField.error}
		{/if}
	</div>
{:else if formField.touched && formField.valid}
	<div class="valid-feedback">
		{#if successMessage}
			{successMessage}
		{/if}
	</div>
{/if}
