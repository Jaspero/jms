<script type="module" lang="ts">
  import SignIn from '../lib/SignIn.svelte';
</script>


<section class="sign-in">
    <SignIn />
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

  form {
      display: flex;
      flex-direction: column;
      justify-content: center;
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
      border: 1px solid black;
      outline: none;
      border-radius: 8px;
      padding: 15px;
      color: black;
      font-size: 16px;
      width: calc(100% - 30px);
  }
  input::placeholder {
      color: black;
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



