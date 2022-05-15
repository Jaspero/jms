import {AUTOMATIC_EMAILS_MODULE} from './emails/automatic-emails.module';
import {SENT_EMAILS_MODULE} from './emails/sent-emails.module';
import {FORMS_MODULE} from './forms.module';
import {PAGES_MODULE} from './pages/pages.module';
import {ROLES_MODULE} from './roles.module';
import {USER_HISTORY_MODULE} from './user-history.module';
import {USER_INVITES_MODULE} from './user-invites.module';
import {USERS_MODULE} from './users.module';
import {LAYOUT_MODULE} from './website/layout.module';
import {DRIVE_MODULE} from './drive.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,
  USER_INVITES_MODULE,
  USER_HISTORY_MODULE,

  DRIVE_MODULE,

  AUTOMATIC_EMAILS_MODULE,
  SENT_EMAILS_MODULE,

  /**
   * Website
   */
  PAGES_MODULE,
  FORMS_MODULE,
  LAYOUT_MODULE,
];
