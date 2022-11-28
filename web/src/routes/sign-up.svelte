<script lang="ts">
  import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
  import { auth } from '$lib/firebase-client';
  import { goto } from '$app/navigation';
  import {page} from '$app/stores';
  import {notificationWrapper} from '$lib/notification/notification';




  let error = ''

  let show = false;
  let email = ''
  let password = ''
  let passwordConfirm = ''
  let loading = false;




  async function onSubmit ()  {

    const {searchParams} = $page.url;

    email = email.toLowerCase().trim();

    loading = true;

    try {
      await notificationWrapper(createUserWithEmailAndPassword(auth, email, password));

      goto(searchParams.has('f') ? decodeURIComponent(searchParams.get('f')) : '/');
    } catch {
      password = '';
    }

    loading = false;

  }

  const togglePassword = () => {
    show = !show;
    document.querySelector('#password').type = show ? 'text' : 'password';
    document.querySelector('#confirm-password').type = show ? 'text' : 'password';
  }

</script>


<section class="sign-up">
  <div class="form-container">
    <h2 class="title">Sign up</h2>
    <form on:submit|preventDefault={onSubmit} method="POST" action="/login">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" />
      <label for="email">Email</label>
      <input type="text" id="email" name="email" bind:value={email} required/>
      <label for="password">Password</label>
      <div class="wrapper">
        <input  id="password" type="password" name="password" bind:value={password}  minlength="6" required/>
      </div>
      <label for="confirm-password">Confirm Password</label>
      <div class="wrapper">
        <input id="confirm-password" type="password" name="confirm-password" bind:value={passwordConfirm}  minlength="6" required/>
      </div>
      <div class="show-password">
        <input type="checkbox" class="checkbox" on:change|preventDefault={togglePassword}>
        <p>Show/hide password</p>
      </div>
      {#if error}
        <div class="error">{error}</div>
      {/if}
      <button class="submit-btn" type="submit">Submit</button>
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
        background: #1C7ED6;
        margin: 0 auto;
    }

    .submit-btn {
        border: 1px solid white;
        border-radius: 4px;
        outline: none;
        background: none;
        font-size: 20px;
        padding:10px 15px;
        color: white;
        margin-top: 40px;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .wrapper {
        width: calc(100% - 30px);
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

    input{
        border: 1px solid white;
        outline: none;
        border-radius: 8px;
        padding: 15px;
        color: #773434;
        font-size: 16px;
        width: calc(100% - 30px);
    }

    input::placeholder {
        color: black;
    }

    .show-password {
        width: calc(100% - 20px);
        justify-content: flex-start;
        display: flex;
        align-items: center;
        color: white;
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
        color: white;
        font-size: 40px;
    }

    .error {
        font-size: 16px;
        color: #773434;
        font-weight: 600;
        margin-top: 20px;
    }

    .show-hide-btn {
        position: absolute;
        right: 10px;
        width: 30px;
        border: none;
        background: none;
        outline: none;
    }

</style>


