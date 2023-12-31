<script context="module">
	import { FormField, FormGroup, Validators } from '$lib/component/share/form';

	class LoginForm extends FormGroup {
		constructor() {
			super();
			this.email = new FormField(
				Validators.checkRequired('Email is required'),
				Validators.checkEmailFormat('Incorrect email. Example: bob@test.com')
			);
			this.password = new FormField(Validators.checkRequired('Password is required'));
		}
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FloatingInput from '$lib/component/share/form/floating-input.svelte';
	import { ToastrService } from '$lib/component/share/toastr.svelte';
	import { AccountService } from '$lib/share/service';
	import { APP_NAME } from '$lib/share/constant';
	import ButtonSpinner from '$lib/component/share/spinner/button-spinner.svelte';

	let loginForm = new LoginForm();

	let isSubmitted = false;

	/**
	 * @param {LoginDTO} loginDTO
	 */
	async function handleLogin(loginDTO) {
		try {
			isSubmitted = true;
			const userInfo = await AccountService.login(loginDTO);
			if (userInfo) {
				ToastrService.notifySuccess(`Welcome back ${userInfo.displayName}`);
				const returnUrl = $page.url.searchParams.get('redirect');
				if (returnUrl) return goto(returnUrl);
				return goto('/');
			}
		} finally {
			isSubmitted = false;
		}
	}

	async function onSubmitForm() {
		await handleLogin({
			email: loginForm.email.value,
			password: loginForm.password.value
		});
	}

	async function onLoginCustomer() {
		await handleLogin({
			email: 'customer@test.com',
			password: 'Pa$$w0rd'
		});
	}

	async function onLoginCustomer1() {
		await handleLogin({
			email: 'customer1@test.com',
			password: 'Pa$$w0rd'
		});
	}
</script>

<svelte:head>
	<title>{APP_NAME} - Sign In</title>
</svelte:head>

<div class="pt-4 pb-2">
	<h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
	<p class="text-center small">Enter your email &amp; password to login</p>
</div>

<form class="row g-3 px-1 needs-validation" on:submit={onSubmitForm}>
	<div class="col-12">
		<div class="form-floating">
			<FloatingInput
				class="form-control rounded-4"
				type="email"
				id="email"
				label="Email"
				placeholder="name@example.com"
				bind:formField={loginForm.email}
				disabled={isSubmitted}
			/>
		</div>
	</div>

	<div class="col-12">
		<div class="form-floating">
			<FloatingInput
				class="form-control rounded-4"
				type="password"
				id="password"
				label="Password"
				placeholder="Password"
				bind:formField={loginForm.password}
				disabled={isSubmitted}
			/>
		</div>
	</div>

	<div class="col-12">
		<div class="form-check">
			<input
				class="form-check-input"
				type="checkbox"
				name="remember"
				value="true"
				id="rememberMe"
			/>
			<label class="form-check-label" for="rememberMe">Remember me</label>
		</div>
	</div>
	<div class="col-12">
		<button
			class="btn btn-info w-100 py-2 mt-2 mb-3 rounded-4"
			type="submit"
			disabled={!loginForm.valid || isSubmitted}
		>
			Login
			{#if isSubmitted}
				<ButtonSpinner />
			{/if}
		</button>
	</div>
	<div class="col-12">
		<p class="small mb-0">
			Don't have account? <a href="/register" class="text-decoration-none">Create an account</a>
		</p>
	</div>
	<div class="col-12">
		<div class="d-flex mb-2">
			<div class="border-secondary-subtle w-100 flex-shrink-1">
				<hr />
			</div>
			<span class="text-center text-nowrap text-secondary">or sign in as</span>
			<div class="border-secondary-subtle w-100 flex-shrink-1">
				<hr />
			</div>
		</div>
		<div class="row row-cols-2 g-2">
			<div class="col d-flex justify-content-center">
				<button
					class="btn btn-outline-info rounded-4"
					type="submit"
					on:click={onLoginCustomer}
					disabled={isSubmitted}
				>
					Demo Customer
					{#if isSubmitted}
						<ButtonSpinner />
					{/if}
				</button>
			</div>
			<div class="col d-flex justify-content-center">
				<button
					class="btn btn-outline-info rounded-4"
					type="submit"
					on:click={onLoginCustomer1}
					disabled={isSubmitted}
				>
					Demo Customer1
					{#if isSubmitted}
						<ButtonSpinner />
					{/if}
				</button>
			</div>
		</div>
	</div>
</form>

<style>
	hr {
		margin: 0.9rem 0;
	}
</style>
