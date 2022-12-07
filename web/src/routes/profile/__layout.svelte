<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {goto} from '$app/navigation';
	import {auth, isLoggedIn} from '../../lib/firebase-client';


	onMount( () => {
	isLoggedIn.subscribe((value => {
			if (!value) {
				goto('/sign-in');
				}
			}))
	});

	onDestroy( () => {
		isLoggedIn;
	});

</script>

<div class="grid">
	<div class="aside">
		<a href="/profile" class="profile-link">
			<img src="/icons/settings.svg" alt="" class="profile-link-icon">
			<p>Account settings</p>
		</a>
		<a href="/profile/update-email" class="profile-link">
			<img src="/icons/email.svg" alt="" class="profile-link-icon">
			<p>Change email</p>
		</a>
		<a href="/profile/update-password" class="profile-link">
			<img src="/icons/password.svg" alt="" class="profile-link-icon">
			<p>Update password</p>
		</a>
		<a href="/profile/delete-account" class="profile-link">
			<img src="/icons/delete-acc.svg" alt="" class="profile-link-icon">
			<p >Delete account</p>
		</a>
		<a href="/profile/orders" class="profile-link">
			<p >Orders</p>
		</a>
	</div>
	<div class="flex-wrapper">
		<slot />
	</div>
</div>

<style>

	.flex-wrapper	{
		padding: 0 20px;
		margin-top: 20px;
	}

	.grid {
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}

	.aside {
		display: flex;
		position: sticky;
		height: fit-content;
		top: 0;
		margin-top: 20px;
		flex-direction: column;
		align-items: center;
		max-width: 400px;
		width: 100%;
		background: white;
		padding: 20px;
		box-shadow: 0 2px 1px -1px rgba(0,0,0,1),
		0 1px 1px 0 rgba(0,0,0,1),
		0 1px 3px 0 rgba(0,0,0,1);
	}
	.profile-link:last-child {
		border: none;
	}

	.profile-link {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 10px 15px;
		border-bottom: 1px solid black;
		transition: .4s ease-in-out;
		cursor: pointer;
	}

	.profile-link-icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.profile-link:hover {
		background: black;
		color: white;
		border-bottom: 1px solid white;
	}

</style>
