<script lang="ts">
  import {goto} from '$app/navigation';
  import {page} from '$app/stores';
  import Button from '$lib/Button.svelte';
  import Dialog from '$lib/Dialog.svelte';
  import {auth} from '$lib/firebase-client';
  import {GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
  import Eye from 'svelte-material-icons/Eye.svelte';
  import EyeOff from 'svelte-material-icons/EyeOff.svelte';
  import {notificationWrapper} from './notification/notification';

  let email = '';
  let password = '';
  let loading = false;

  let rEmail = '';
  let rLoading = false;
  let rDialog = false;

  let passwordEl: HTMLInputElement;

  const provider = new GoogleAuthProvider();

  async function googleSignIn() {
    await notificationWrapper(signInWithPopup(auth, provider));
    navigate();
  }

  async function passwordSignIn() {
    email = email.toLowerCase().trim();

    loading = true;

    try {
      await notificationWrapper(signInWithEmailAndPassword(auth, email, password));
      navigate();
    } catch {
      password = '';
    }

    email = '';
    loading = false;
  }

  async function resetPassword() {
    rEmail = rEmail.trim().toLowerCase();

    if (!rEmail) {
      return;
    }

    rLoading = true;

    try {
      await notificationWrapper(sendPasswordResetEmail(auth, rEmail, {url: `${location.origin}/reset-password`}), 'A password reset link has been sent to your email.');
      rDialog = false;
    } catch (e) {
      console.error(e);
    }

    rEmail = '';
    rLoading = false;
  }

  function togglePasswordType() {
    passwordEl.type = passwordEl.type === 'password' ? 'text' : 'password';
  }

  function navigate() {
    const {searchParams} = $page.url;
    goto(searchParams.has('f') ? decodeURIComponent(searchParams.get('f') as string) : '/');
  }
</script>

<div class="form-container">
  <h2 class="title">Sign in</h2>
  <form on:submit|preventDefault={passwordSignIn}>
    <label for="email">Email</label>

    <label>
      <span>Email</span>
      <input type="email" name="email" bind:value={email} required />
    </label>

    <label>
      <span>Password</span>
      <input type="password" name="password" minlength="6" required bind:value={password} bind:this={passwordEl} />
    </label>

    <button type="button" on:click|preventDefault={togglePasswordType}>
      {#if passwordEl?.type === 'password'}
        <Eye />
      {:else}
        <EyeOff />
      {/if}
    </button>

    <div class="btn-wrapper">
      <button type="button" class="forgot-dialog" on:click={() => (rDialog = true)}>Forgot your password?</button>
    </div>
    <div class="google-btn" on:click|preventDefault={googleSignIn}>
      <img src="/icons/google.svg" alt="google icon" class="google-icon" width="23" />
      <span>Sign in with google</span>
    </div>
    <Button type="submit" {loading}>Submit</Button>
  </form>
</div>

<Dialog bind:opened={rDialog} showConfirmation={false} title="Forgot password?" subtitle="Write your email below and instruction for email reset will be sent to you">
  <form on:submit|preventDefault={resetPassword}>
    <label>
      <span>Email</span>
      <input placeholder="email" type="email" name="email" required bind:value={rEmail} />
    </label>
    <Button type="submit" loading={rLoading}>Reset password</Button>
  </form>
</Dialog>

<style>
  .form-container {
    width: 500px;
    padding: 20px;
    background: #67131e;
    margin: 0 auto;
  }

  .google-btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    border: 1px solid white;
    border-radius: 4px;
    outline: none;
    background: none;
    font-size: 20px;
    padding: 10px 15px;
    color: white;
    margin: 40px 0;
    width: calc(100% - 40px);
  }

  .google-icon {
    margin-right: 10px;
  }

  .submit-btn {
    border: 1px solid white;
    border-radius: 4px;
    outline: none;
    background: none;
    font-size: 20px;
    padding: 10px 15px;
    color: white;
    width: calc(100% - 40px);
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .btn-wrapper {
    width: 100%;
    text-align: left;
  }
  .wrapper {
    width: calc(100% - 40px);
    position: relative;
    display: flex;
    align-items: center;
  }

  .wrapper input {
    width: 100%;
  }

  label {
    margin-top: 20px;
    text-align: left;
    width: 100%;
    padding: 10px 20px;
    color: white;
    font-weight: 600;
  }

  input {
    border: 1px solid black;
    outline: none;
    border-radius: 8px;
    padding: 15px;
    color: black;
    font-size: 16px;
    width: calc(100% - 30px);
  }
  input::placeholder {
    color: black;
  }

  .show-hide-btn {
    position: absolute;
    right: 0;
    width: 35px;
    border: none;
    background: none;
    outline: none;
  }

  .title {
    text-align: center;
    color: white;
    font-size: 40px;
  }

  .forgot-dialog {
    background: none;
    outline: none;
    color: white;
    border: none;
    padding: 10px 20px;
  }

  .forgot-dialog:hover {
    text-decoration: underline;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
