import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import { auth } from '$lib/firebase-client';
import {goto} from '$app/navigation';
import {page} from '$app/stores';




let email = ''
let password = ''
let loading = false;


let show = false;
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');




export async function googleSignIn () {
  const {searchParams} = $page.url;

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      goto(searchParams.has('f') ? decodeURIComponent(searchParams.get('f')) : '/');
      console.log(user)
      email = ''
    }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
}

export async function reLog() {
  const {searchParams} = $page.url;

  email = email.toLowerCase().trim();

  loading = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    await goto(searchParams.has('f') ? decodeURIComponent(searchParams.get('f')) : '/');
  } catch {
    password = '';
  }
  email = ''
  loading = false;
}



export const toggle1 = () => {
  show = !show;
  document.querySelector('#password').type = show ? 'text' : 'password';
}

