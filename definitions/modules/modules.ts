import {ROLES_MODULE} from './roles.module';
import {USER_HISTORY_MODULE} from './user-history.module';
import {USER_INVITES_MODULE} from './user-invites.module';
import {USERS_MODULE} from './users.module';
import {PAGES_MODULE} from './pages/pages.module';
import {STORAGE_MODULE} from './storage.module';
import {LAYOUT_MODULE} from './website/layout.module';
import {POSTS_MODULE} from './pages/posts.module';
import {INQUIRIES_MODULE} from './inquiries.module';
import {AUTOMATIC_EMAILS_MODULE} from './emails/automatic-emails.module';
import {SENT_EMAILS_MODULE} from './emails/sent-emails.module';
import {PRODUCTS_MODULE} from './shop/products.module';
import {PRODUCT_CATEGORIES_MODULE} from './shop/product-categories.module';
import {PRODUCT_TAGS_MODULE} from './shop/product-tags.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,
  USER_INVITES_MODULE,
  USER_HISTORY_MODULE,
  INQUIRIES_MODULE,
  STORAGE_MODULE,
  
  AUTOMATIC_EMAILS_MODULE,
  SENT_EMAILS_MODULE,

  /**
   * Website
   */
  LAYOUT_MODULE,
  PAGES_MODULE,
  POSTS_MODULE,

  /**
   * Shop
   */
  PRODUCTS_MODULE,
  PRODUCT_CATEGORIES_MODULE,
  PRODUCT_TAGS_MODULE,

  AUTOMATIC_EMAILS_MODULE,
  SENT_EMAILS_MODULE,
];
