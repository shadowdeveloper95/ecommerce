<script context="module">
	import { Modal } from 'bootstrap';
	import { onMount } from 'svelte';

	class SpinnerService {
		/**
		 * @type {string}
		 */
		static #spinnerModalId;

		/**
		 * @param {string} id
		 */
		static setSpinnerId(id) {
			this.#spinnerModalId = id;
		}

		static showSpinner() {
			/**
			 * @type {import("bootstrap").Modal}
			 */
			if (document.getElementById(this.#spinnerModalId) === null) return;
			const modal = Modal.getOrCreateInstance(document.getElementById(this.#spinnerModalId));
			modal.show(modal);
		}

		static hideSpinner() {
			/**
			 * @type {import("bootstrap").Modal | null}
			 */
			if (document.getElementById(this.#spinnerModalId) === null) return;
			const modal = Modal.getInstance(document.getElementById(this.#spinnerModalId));
			modal?.hide();
		}
	}

	export { SpinnerService };
</script>

<script>
	/**
	 * @type {string}
	 */
	export let id;
	let isReady = false;
	onMount(() => (isReady = true));
</script>

<div
	class="modal"
	tabindex="-1"
	aria-hidden="true"
	data-bs-backdrop="static"
	data-bs-keyboard="false"
	class:fade={isReady}
	{id}
>
	<div class="modal-dialog modal-dialog-centered justify-content-center">
		<div class="spinner-custom"></div>
	</div>
</div>

<style lang="scss">
	.spinner-custom {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: 9px solid whitesmoke;
		/* border: 9px solid #474bff */
		animation:
			spinner-bulqg1 1.1199999999999999s infinite linear alternate,
			spinner-oaa3wk 2.2399999999999998s infinite linear;
	}

	@keyframes spinner-bulqg1 {
		0% {
			clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
		}

		12.5% {
			clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
		}

		25% {
			clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
		}

		50% {
			clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
		}

		62.5% {
			clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
		}

		75% {
			clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
		}

		100% {
			clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
		}
	}

	@keyframes spinner-oaa3wk {
		0% {
			transform: scaleY(1) rotate(0deg);
		}

		49.99% {
			transform: scaleY(1) rotate(135deg);
		}

		50% {
			transform: scaleY(-1) rotate(0deg);
		}

		100% {
			transform: scaleY(-1) rotate(-135deg);
		}
	}
</style>
