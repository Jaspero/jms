import {ROLES_COLLECTION} from './roles.collection';
import {SETTINGS_COLLECTION} from './settings.collection';
import {USER_INVITES_COLLECTION} from './user-invites.collection';

/**
 * A list of collections to create initially
 */
export const COLLECTIONS = [
  SETTINGS_COLLECTION,
  ROLES_COLLECTION,
  USER_INVITES_COLLECTION
];
