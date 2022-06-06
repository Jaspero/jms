import {ROLES_MODULE} from './roles.module';
import {USER_HISTORY_MODULE} from './user-history.module';
import {USER_INVITES_MODULE} from './user-invites.module';
import {USERS_MODULE} from './users.module';
import {PAGES_MODULE} from './pages/pages.module';
import {DRIVE_MODULE} from './drive.module';
import {LAYOUT_MODULE} from './website/layout.module';
import {POSTS_MODULE} from './pages/posts.module';
import {INQUIRIES_MODULE} from './inquiries.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,
  USER_INVITES_MODULE,
  USER_HISTORY_MODULE,
  DRIVE_MODULE,
  INQUIRIES_MODULE,

  /**
   * Website
   */
  LAYOUT_MODULE,
  PAGES_MODULE,
  POSTS_MODULE
];
