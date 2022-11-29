<script lang="ts">
  import { auth } from '$lib/firebase-client';
  import { deleteUser   } from "firebase/auth";
  import {goto} from '$app/navigation';
  import {page} from '$app/stores';


  let email = '';
  let loading = false;
  const user = auth.currentUser;

  function onSubmit() {
    deleteUser(user).then(() => {
      // User deleted.
    }).catch((error) => {

    });
    console.log('user deleted')
  }
</script>


<div class="grid">
  <h1 class="title">Delete account</h1>
  <form on:submit|preventDefault={onSubmit}>
    <p class="ta-center">Warning:Deleting user data is permanent procedure that cannot be canceled. All your personal information will be deleted from our system</p>
    <button class="submit-btn" type="submit" {loading}>Delete user data</button>
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

    .ta-center {
      text-align: center;
    }

    .submit-btn {
        border: 1px solid #ba1f1f;
        border-radius: 8px;
        outline: none;
        background: none;
        font-size: 20px;
        padding:10px 15px;
        color: #a01515;
        width: 100%;
        margin-top: 20px;
        transition: .4s all ;
    }

    .submit-btn:hover {
        border: 1px solid white;
        background: #ba1f1f;
        color: white;
    }

</style>
