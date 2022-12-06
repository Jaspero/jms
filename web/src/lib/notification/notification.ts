import {FirebaseError} from 'firebase/app';
import {writable} from 'svelte/store';

const firebaseErrors = {
  'auth/wrong-password': 'This email and password combination is incorrect.',
  'auth/too-many-requests': 'Access to this account is currently disabled. You can retrieve access by reseting your password or by trying later.',
  'auth/user-not-found': 'There is no user with tha email registered',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/missing-email': 'This email is not valid',
  'auth/email-already-in-use': 'This email is already in use',
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
