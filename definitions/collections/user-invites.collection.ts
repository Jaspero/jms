import {Collections} from '../interfaces/collections';

/**
 * List all users that should be created initially.
 * Initially created users can only login through
 * third party provides (google, facebook...).
 * If you want to create a user with email/password
 * add an account for him in Authentication in the
 * firebase dashboard.
 */
export const USER_INVITES_COLLECTION = {
  name: Collections.UserInvites,
  documents: []
};
