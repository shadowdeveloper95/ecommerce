<script context="module">
	import { writable } from 'svelte/store';

	/**
	 * @type {import('svelte/store').Writable<{message:string, type: Toastr.Type}[]>}
	 */
	const toastsStore = writable([]);

	let isSingle = false;

	/**
	 * @param {string} message
	 * @param {Toastr.Type} type
	 */
	function notify(message, type) {
		if (isSingle) {
			toastsStore.set([{ message, type }]);
			return;
		}

		toastsStore.update((toasts) => {
			toasts.push({ message, type });
			return toasts;
		});
	}

	/**
	 * @param {string} message
	 */
	function notifyDanger(message) {
		notify(message, 'DANGER');
	}

	/**
	 * @param {string} message
	 */
	function notifySuccess(message) {
		notify(message, 'SUCCESS');
	}

	/**
	 * @param {string} message
	 */
	function notifyWarning(message) {
		notify(message, 'WARNING');
	}

	/**
	 * @param {string} message
	 */
	function notifyInfo(message) {
		notify(message, 'INFO');
	}

	const ToastrService = {
		notify,
		notifySuccess,
		notifyDanger,
		notifyWarning,
		notifyInfo
	};

	export { ToastrService };
</script>

<script>
	import Toast, { hide } from './toast.svelte';

	export { classNames as class };
	/**
	 * @type {string}
	 */
	let classNames;

	export let isSingleToast = false;

	isSingle = isSingleToast;
	$: toasts = $toastsStore;
</script>

<div class={classNames}>
	{#each toasts as toast}
		{#key toast}
			<Toast message={toast.message} type={toast.type} on:click={hide} />
		{/key}
	{/each}
</div>
