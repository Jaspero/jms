<script lang="ts">
  import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
  import { auth } from '$lib/firebase-client';
  import { goto } from '$app/navigation';
  import {page} from '$app/stores';
  import {notificationWrapper} from '$lib/notification/notification';
  import Button from '$lib/Button.svelte';




  let error = ''

  let show = false;
  let email = ''
  let password = ''
  let passwordConfirm = ''
  let loading = false;
  let wfull = true;

  let passwordEl: HTMLInputElement;
  let confirmEl: HTMLInputElement;




  async function signUp ()  {

    email = email.toLowerCase().trim();

    loading = true;

    try {
      await notificationWrapper(createUserWithEmailAndPassword(auth, email, password));
      navigate();
    } catch {
      password = '';
    }

    loading = false;
    passwordConfirm = ''
  }

  function navigate() {
    const {searchParams} = $page.url;
    goto(searchParams.has('f') ? decodeURIComponent(searchParams.get('f') as string) : '/');
  }




  function togglePasswordType() {
    passwordEl.type = passwordEl.type === 'password' ? 'text' : 'password';
    confirmEl.type = confirmEl.type === 'password' ? 'text' : 'password';
  }

</script>


<section class="sign-up">
  <div class="form-container">
    <h2 class="title">Sign up</h2>
    <form on:submit|preventDefault={signUp}>
      <label>
        <span>Name</span>
        <input type="text" name="name" required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" bind:value={email} required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" required bind:value={password} bind:this={passwordEl} />
      </label>
      <label>
        <span>Confirm password</span>
        <input type="password" name="confirm-password" required bind:value={passwordConfirm} bind:this={confirmEl} />
      </label>
      <div class="show-password">
        <input type="checkbox" class="checkbox" on:change|preventDefault={togglePasswordType}>
        <p>Show/hide password</p>
      </div>
      {#if error}
        <div class="error">{error}</div>
      {/if}
      <Button type="submit" {wfull} {loading}>Submit</Button>
    </form>
  </div>
</section>


<style>
    .sign-up {
        height: 100vh;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .form-container {
        width: 500px;
        padding: 20px;
        background: white;
        margin: 0 auto;
        -webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
        border-radius: 16px;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    label {
        text-align: left;
        width: 100%;
        padding: 10px 0;
        color: black;
        font-weight: 600;
        position: relative;
    }

    input{
        border: 1px solid black;
        outline: none;
        border-radius: 8px;
        padding: 15px;
        color: black;
        font-size: 16px;
        width: 100%;
        margin-top: 5px;
    }

    input::placeholder {
        color: black;
    }

    .show-password {
        width: 100%;
        justify-content: flex-start;
        display: flex;
        align-items: center;
        color: black;
        margin-top: 10px;
    }

    .checkbox {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .title {
        text-align: center;
        color: black;
        font-size: 40px;
    }

    .error {
        font-size: 16px;
        color: #773434;
        font-weight: 600;
        margin-top: 20px;
    }

</style>


