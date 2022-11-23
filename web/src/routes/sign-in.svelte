<script type="module" lang="ts">
  import { onMount } from 'svelte'
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from '$lib/firebase-client';
  import {goto} from '$app/navigation';


  let email = ''
  let password = ''
  let user = ''
  let dialog = false;
  let show = false;
  onMount(() => {
    dialog = document.getElementById('password-reset-dialog');
  })

  const showDialogClick = (asModal = true) => {
    try {
      dialog[asModal ? 'showModal' : 'show']();
    } catch(e) {
      (e.message);
    }
  };

  const closeClick = () => {
    dialog.close();
  };


  async function onSubmit() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        goto('/');
        // ...
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const toggle1 = () => {
    show = !show;
    document.querySelector('#password').type = show ? 'text' : 'password';
  }


</script>


<section class="sign-in">
  <div class="form-container">
    <h2 class="title">Sign in</h2>
    <form on:submit|preventDefault={onSubmit}>
      <label for="email">Email</label>
      <div class="wrapper">
        <input type="email" id="email" name="email" bind:value={email} required />
      </div>
      <label for="password">Password</label>
      <div class="wrapper">
        <input  id="password" type="password" name="password" minlength="6" bind:value={password} required/>
        <button class="show-hide-btn" type="button" on:click|preventDefault={toggle1}>
          {#if show}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          {/if}
        </button>
      </div>
      <div class="btn-wrapper">
      <button class="forgot-dialog" on:click={() => showDialogClick(true)}>Forgot your password?</button>
      </div>
      <button class="submit-btn" type="submit">Submit</button>
<!--      <button class="submit-btn" type="submit" on:click={loginWithGoogle()}>google</button>-->
    </form>
  </div>
    <dialog id="password-reset-dialog">
      <h1>Forgot password ?</h1>
      <p>Enter your registered email to reset your password.</p>
      <form action="submit">
        <input class="dialog-input" type="email" id="password-reset" name="password-reset" value="" required/>
        <div on:click={closeClick} class="close">
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g data-name="Layer 2">
              <path d="m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" data-name="close"/>
            </g>
          </svg>
        </div>
        <button class="forgot-psw-btn" type="submit">Send</button>
      </form>
    </dialog>
</section>

<style>
  .sign-in {
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

  .dialog-input {
    width: 100%;
    border: 1px solid black;
    padding: 10px 15px;
    margin: 10px 0;
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

  dialog {
    border-radius: 5px;
    border: none;
    transition: all 2s;
    background: white;
    padding: 20px;
      position: relative;
  }
  dialog::backdrop {
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));
      animation: fade-in 1s;
  }

  .forgot-psw-btn {
      border: 1px solid #1C7ED6;
      border-radius: 4px;
      outline: none;
      background: none;
      font-size: 20px;
      padding:10px 15px;
      color: black;
  }

  .close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
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



