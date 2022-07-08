import {AUTOMATIC_EMAILS_COLLECTION} from './automatic-emails.collection';
import {FOLDERS_COLLECTION} from './folders.collection';
import {ROLES_COLLECTION} from './roles.collection';
import {USER_INVITES_COLLECTION} from './user-invites.collection';

/**
 * A list of collections to create initially
 */
export const COLLECTIONS: Array<{
  name: string;
  options?: any;
  clear?: (data: any) => any;
  documents: any[];
}> = [
  ROLES_COLLECTION,
  USER_INVITES_COLLECTION,
  FOLDERS_COLLECTION,
  AUTOMATIC_EMAILS_COLLECTION
];
