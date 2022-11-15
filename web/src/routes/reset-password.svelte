<section class="sign-up">
  <div class="form-container">
    <h2 class="title">Reset password</h2>
    <form on:submit|preventDefault={onSubmit}>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" bind:value={fields.password} minlength="6" required/>
      <label for="confirm-password">Confirm Password</label>
      <input type="password" id="confirm-password" name="confirm-password" bind:value={fields.passwordConfirm} required/>
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
    }

</style>

<script lang="ts">
  let valid = false;
  let error = ''
  let fields = {password: '', passwordConfirm: ''}
  let email = "";

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

</script>
