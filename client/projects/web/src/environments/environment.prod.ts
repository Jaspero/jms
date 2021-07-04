import {ENV_CONFIG} from '../../../../env-config';

export const environment = {
  production: true,
  firebase: ENV_CONFIG.firebase,
  firebaseEmulators: false
};
