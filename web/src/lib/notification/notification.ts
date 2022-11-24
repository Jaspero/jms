import {FirebaseError} from 'firebase/app';
import {writable} from 'svelte/store';

const firebaseErrors = {
  'auth/wrong-password': 'This email and password combination is incorrect.',
  'auth/too-many-requests': 'Access to this account is currently disabled. You can retrieve access by reseting your password or by trying later.',
  'auth/user-not-found': 'This email and password combination is incorrect.',
  'auth/weak-password': 'Please enter better/stornger password.',
  'auth/missing-email': 'This mail is not valid'
}

export const notification = writable(null);

export async function notificationWrapper(
  request,
  successMessage = '',
  errorMessage =(e) => e.message
) {
  let resp;

  try {
    resp = await request;
    if (successMessage) {
      notification.set({content: successMessage});
    }
  } catch (e) {

    if (errorMessage !== false) {

      const content = {
        type: 'error',
        content: typeof errorMessage === 'function' ?
          errorMessage(e) :
          errorMessage || e.toString()
      };

      if (e instanceof FirebaseError) {
        content.content = firebaseErrors[e.code] || '';
      }

      notification.set(content);
    }

    console.error(e);

    throw e;
  }

  return resp;
}
