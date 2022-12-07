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


</style>
