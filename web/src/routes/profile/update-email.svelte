<script lang="ts">
  import {auth} from '$lib/firebase-client';
  import {updateEmail, updatePassword} from 'firebase/auth';
  import SignInDialog from '../../lib/SignInDialog.svelte';

  let opened = false;
  let email = '';
  let loading = false;
  const user = auth.currentUser;

  async function onSubmit() {
    try {
      await updateEmail(user, email);
    } catch (err) {
      if (err) {
        opened = true
      }
      console.log(err);
    }
    email = '';
  }
</script>


<div class="grid">
  <h1 class="title">Email update</h1>
  <form on:submit|preventDefault={onSubmit}>
    <label for="update-email">Email</label>
    <div class="wrapper">
      <input placeholder="email" type="email" id="update-email" name="email" bind:value={email} required />
    </div>
    <button class="submit-btn" type="submit" {loading}>Submit</button>
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

</style>
