import {ENV_CONFIG} from '../../../../env-config';

export const environment = {
  production: false,
  firebase: ENV_CONFIG.firebase,
  firebaseEmulators: false
};
