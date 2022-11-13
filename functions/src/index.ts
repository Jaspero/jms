import * as admin from 'firebase-admin';
import {createUser} from './callable/create-user';
import {exchangeToken} from './callable/exchange-token';
import {getUser} from './callable/get-user';
import {impersonate} from './callable/impersonate';
import {removeUser} from './callable/remove-user';
import {sampleEmail} from './callable/sample-email';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateEmail} from './callable/update-email';
import {updateUser} from './callable/update-user';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {proxy} from './rest/proxy';
import {documentDeleted} from './triggers/document-deleted';
import {documentWrite} from './triggers/document-write';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {fileMetadataUpdated} from './triggers/file-metadata-updated';
import {roleUpdated} from './triggers/role-updated';
import {storageItemDeleted} from './triggers/storage-item-deleted';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {userDocumentUpdated} from './triggers/user-document-updated';

admin.initializeApp();

export {actionController} from './standalone/action-controller';

export const cms = {
  // Triggers
  userCreated,
  userDeleted,
  userDocumentUpdated,
  fileCreated,
  fileDeleted,
  fileMetadataUpdated,
  documentDeleted,
  documentWrite,
  triggerPasswordReset,
  roleUpdated,
  storageItemDeleted,

  // Callable
  createUser,
  removeUser,
  updateUser,
  getUser,
  updateEmail,
  exchangeToken,
  impersonate,
  sampleEmail,

  // Rest
  exportData,
  importData,
  proxy
};
