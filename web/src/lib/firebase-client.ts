import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {writable} from 'svelte/store';

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBpOVW-c-ExPTUHRAXRO8-yTUVPq0pKS1g',
  authDomain: 'jaspero-jms.firebaseapp.com',
  databaseURL: 'https://jaspero-jms.firebaseio.com',
  projectId: 'jaspero-jms',
  storageBucket: 'jaspero-jms.appspot.com',
  messagingSenderId: '82190793734',
  appId: '1:82190793734:web:e6abf3c3a3bbb744'
});



export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export let isLoggedIn = writable(false);
