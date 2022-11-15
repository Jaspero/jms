<section class="sign-in">
  <div class="form-container">
    <h2 class="title">Sign in</h2>
    <form on:submit|preventDefault={onSubmit}>
      <label for="email">Email</label>
      <input type="text" id="email" name="email" value="" required/>
      <label for="password">Password</label>
      <input type="text" id="password" name="password" value="" required/>
      <div class="wrapper">
      <button class="forgot-dialog" on:click={() => showDialogClick(true)}>Forgot your password?</button>
      </div>
      <button class="submit-btn" type="submit">Submit</button>
    </form>
    <dialog id="password-reset-dialog">
      <h1>Forgot password ?</h1>
      <p>Enter your registered email to reset your password.</p>
      <input class="dialog-input" type="text" id="password-reset" name="password-reset" value=""/>
      <button on:click={closeClick}>Close</button>
    </dialog>
  </div>
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

  .wrapper {
      width: 100%;
      text-align: right;
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
  .title {
    text-align: center;
    color: white;
    font-size: 40px;
  }

  .dialog-input {
    border: 1px solid black;
    padding: 10px 15px;
    margin-bottom: 10px;
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
  }
  dialog::backdrop {
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));
    animation: fade-in 1s;
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


<script lang="ts">
  import { onMount } from 'svelte'

  let dialog;
  onMount(() => {
    dialog = document.getElementById('password-reset-dialog');
  })

  let showDialogClick = (asModal = true) => {
    try {
      dialog[asModal ? 'showModal' : 'show']();
    } catch(e) {
    }
  };

  const closeClick = () => {
    dialog.close();
  };


  function onSubmit(e) {
    const formData = new FormData(e.target);

    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data)
  }
</script>
