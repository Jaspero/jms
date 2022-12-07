<script lang="ts">
  import {auth} from '$lib/firebase-client';
  import {updateEmail, updatePassword} from 'firebase/auth';
  import {notification} from '../../lib/notification/notification';
  import SignInDialog from '../../lib/SignInDialog.svelte';
  import Button from '$lib/Button.svelte';
  import Pencil from 'svelte-material-icons/Pencil.svelte';

  let view = false;
  let password = '';
  let email = '';
  let loading = false;
  let opened = false;
  let success = 'Password update successfull';
  let error = 'Cant update to email that you are using already';
  const user = auth.currentUser;

  async function passwordUpdate() {
    try {
      await updatePassword(user, password);
      notification.set({content: success, type: 'success'});
    } catch (err) {
      if (err) {
        opened = true;
      }
    }
    password = '';
  }

  async function emailUpdate() {
    error = 'Cant update to email that you are using already'
    if (email === user.email) {
      notification.set({content: error, type: 'error'});
      return;
    }
    try {
      await updateEmail(user, email);
      notification.set({content: success, type: 'success'});
    } catch (err) {
      if (err) {
        opened = true
      }
      console.log(err);
    }
    email = '';
  }

  function toggleEdit() {
    view = !view;
  }

</script>


<div class="grid">



  <h2 class="title">My details</h2>
  <p>Edit the info below to update your details</p>
  <div class="card">
    <div class="view">
      <h2>Password</h2>
      <div class="edit-wrapper" on:click|preventDefault={toggleEdit}>
        <Pencil />
        <p class="edit">Edit</p>
      </div>
    </div>
    {#if view}
    <form on:submit|preventDefault={passwordUpdate}>
      <label>
        <span>Update password</span>
        <input type="password" name="update-password" required bind:value={password} />
      </label>
      <Button type="submit" {loading}>Submit</Button>
    </form>
      {:else}
        <p style="width: 400px;">********</p>
      {/if}
  </div>
  <div class="card">
    <div class="view">
      <h2>Email</h2>
      <div class="edit-wrapper" on:click|preventDefault={toggleEdit}>
        <Pencil />
        <p class="edit">Edit</p>
      </div>
    </div>
    <form on:submit|preventDefault={emailUpdate}>
      <label>
        <span>Update email</span>
        <input type="email" name="update-email" required bind:value={email} />
      </label>
      <Button type="submit" {loading}>Submit</Button>
    </form>
  </div>
  <SignInDialog bind:opened={opened} />
</div>


<style>
    .grid  {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 100%;
    }

    .title {
        width: 100%;
        text-align: left;
    }

    .card {
        margin: 40px 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        padding: 20px;
        border-radius: 8px;
        -webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
    }

    form {
        width: 400px;
        background: white;
        border-radius: 8px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    input{
        border: 1px solid black;
        outline: none;
        border-radius: 8px;
        padding: 15px;
        color: black;
        font-size: 16px;
        margin-top: 5px;
        width: 100%;
    }

    label {
        text-align: left;
        width: 100%;
        color: black;
        font-weight: 600;
        position: relative;
    }

    .view {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .edit-wrapper {
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .edit {
       margin-left: 5px;
    }
</style>
