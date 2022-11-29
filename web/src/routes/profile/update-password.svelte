<script lang="ts">
  import { auth } from '$lib/firebase-client';
  import { updatePassword   } from "firebase/auth";
  let password = '';
  let loading = false;



  async function onSubmit() {
    const user = auth.currentUser;
    try {
      await updatePassword (user, password);
    }
    catch(err) {
      if (err) {
        console.log('yup this is an error');
      }
      console.log(err);
    }
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

</style>
