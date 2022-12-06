<script lang="ts">
  import {auth} from '$lib/firebase-client';
  import {updatePassword} from 'firebase/auth';
  import {notification} from '../../lib/notification/notification';
  import SignInDialog from '../../lib/SignInDialog.svelte';
  import Button from '$lib/Button.svelte';


  let password = '';
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
</script>


<div class="grid">
  <h1 class="title">Password update</h1>
  <form on:submit|preventDefault={passwordUpdate}>
    <label>
      <span>Update password</span>
      <input type="password" name="update-password" required bind:value={password} />
    </label>
    <Button type="submit" {loading}>Submit</Button>
  </form>
</div>
<SignInDialog bind:opened={opened} />


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

</style>
