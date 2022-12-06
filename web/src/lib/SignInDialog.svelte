<script>
  import Dialog from './Dialog.svelte';
  import SignIn from './SignIn.svelte';


 export let opened = false;

 let showConfirmation = false;

 export let title = 'You have been inactive for a while';

 export let subtitle = 'Please re log so you can update your email or password';
</script>


<Dialog class="update-dialog" bind:opened={opened} {showConfirmation} title="{title}" subtitle="{subtitle}">
    <slot>
      <SignIn />
    </slot>
</Dialog>



<style>
    :global(.update-dialog .form-container) {
        box-shadow: none;
        padding: 0;
    }

</style>


