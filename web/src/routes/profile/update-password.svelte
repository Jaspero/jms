<script lang="ts">
  import {auth} from '$lib/firebase-client';
  import {updatePassword} from 'firebase/auth';
  import SignInDialog from '../../lib/SignInDialog.svelte';
  import Button from '../../lib/Button.svelte';
  import {reLog} from '../../lib/sign-in';
  import {googleSignIn} from '../../lib/sign-in';
  import {page} from '$app/stores';


  let password = '';
  let relogPassword = '';
  let loading = false;
  let rLoading = false;
  let email = '';
  let passwordDialog = false;



  async function onSubmit() {
    const user = auth.currentUser;
    try {
      await updatePassword(user, password);
    } catch (err) {
      if (err) {
        passwordDialog = true;
      }
      console.log(err);
    }
    password = '';
    console.log(password);
  }
</script>


<div class="grid">
  <h1 class="title">Password update</h1>
  <form on:submit|preventDefault={onSubmit}>
    <label for="password">Password</label>
    <div class="wrapper">
      <input placeholder="password" type="password" id="password" name="email" bind:value={password} required />
    </div>
    <button class="submit-btn" type="submit" {loading}>Submit</button>
  </form>
  <SignInDialog bind:opened={passwordDialog} showConfirmation={false} title="Some title" subtitle="Please re log to update you password">
    <form slot="content" on:submit|preventDefault={reLog}>
      <label for="reEmail">Email</label>
      <div class="wrapper">
        <input placeholder="email" type="email" name="email" id="reEmail" required bind:value={email} />
      </div>
      <label for="rePassword">Password</label>
      <div class="wrapper">
        <input placeholder="password" type="password" name="password" id="rePassword" required bind:value={relogPassword} />
      </div>
      <div class="google-btn" on:click|preventDefault={googleSignIn}>
        <img src="/icons/google.svg" alt="google icon" class="google-icon" width="23">
        <span>Sign in with google</span>
      </div>
      <Button type='submit' loading={rLoading}>Submit</Button>
    </form>
  </SignInDialog>
</div>


<style>
    .grid  {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 auto;
    }

    .title {
      width: 100%;
      text-align: center;
    }

    form {
      width: 400px;
      background: white;
      border: 1px solid black;
      padding: 20px;
      border-radius: 8px;
    }

    input{
      border: 1px solid black;
      outline: none;
      border-radius: 8px;
      padding: 15px;
      color: black;
      font-size: 16px;
      width: 100%;
    }
    input::placeholder {
      color: black;
    }

    .submit-btn {
      border: 1px solid black;
      border-radius: 8px;
      outline: none;
      background: none;
      font-size: 20px;
      padding:10px 15px;
      color: black;
      width: 100%;
      margin-top: 20px;
    }

    form {
      text-align: center;
    }
    .wrapper {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }


    .google-btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        border: 1px solid black;
        border-radius: 4px;
        outline: none;
        background: none;
        font-size: 20px;
        padding:10px 15px;
        color: black;
        margin-top:20px;
        width: 100%;
    }

    label {
        width: 100%;
        text-align: left;
    }

</style>
