import {ENV_CONFIG} from '../../../../env-config';

export const environment = {
  origin: 'http://localhost:5000',
  production: false,
  firebase: ENV_CONFIG.firebase,
  firebaseEmulators: false
};
