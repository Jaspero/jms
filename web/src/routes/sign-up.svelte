<script lang="ts">
  let valid = false;
  let error = ''
  let fields = {password: '', passwordConfirm: ''}
  let email = "";
  let show = false;
  let visible = false;

  const onSubmit = () => {
    valid = true
    if (fields.password !== fields.passwordConfirm) {
      valid = false;
      error = "Password do not match.";
    }else {
      error = ''
      valid = true
    }
    if (valid) {
      console.log('valid', fields)
    }
  }

  const toggle1 = () => {
    show = !show;
    document.querySelector('#password').type = show ? 'text' : 'password';
  }

  const toggle2 = () => {
    visible = !visible;
    document.querySelector('#confirm-password').type = visible ? 'text' : 'password';
  }
</script>


<section class="sign-up">
  <div class="form-container">
    <h2 class="title">Sign up</h2>
    <form on:submit|preventDefault={onSubmit} method="POST" action="/login">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" bind:value={fields.name} />
      <label for="email">Email</label>
      <input type="text" id="email" name="email" bind:value={fields.email} required/>
      <label for="password">Password</label>
      <div class="wrapper">
        <input  id="password" type="password" name="password" bind:value={fields.password}  minlength="6" required/>
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
      <label for="confirm-password">Confirm Password</label>
      <div class="wrapper">
        <input id="confirm-password" type="password" name="confirm-password" bind:value={fields.passwordConfirm}  minlength="6" required/>
        <button class="show-hide-btn" type="button" on:click|preventDefault="{toggle2}">
          {#if visible}
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
        right: 0;
        width: 35px;
        border: none;
        background: none;
        outline: none;
    }

</style>


