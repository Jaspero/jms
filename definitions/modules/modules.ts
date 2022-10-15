import {ROLES_MODULE} from './roles.module';
import {USER_HISTORY_MODULE} from './user-history.module';
import {USER_INVITES_MODULE} from './user-invites.module';
import {USERS_MODULE} from './users.module';
import {STORAGE_MODULE} from './storage.module';
import {AUTOMATIC_EMAILS_MODULE} from './emails/automatic-emails.module';
import {SENT_EMAILS_MODULE} from './emails/sent-emails.module';
import {ROLE_HISTORY_MODULE} from './role-history.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,
  USER_INVITES_MODULE,
  USER_HISTORY_MODULE,
  ROLE_HISTORY_MODULE,
  STORAGE_MODULE,

  AUTOMATIC_EMAILS_MODULE,
  SENT_EMAILS_MODULE,
];
