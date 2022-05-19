import {initializeApp} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {exchangeToken} from './callable/exchange-token';
import {getUser} from './callable/get-user';
import {removeUser} from './callable/remove-user';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateEmail} from './callable/update-email';
import {updateUser} from './callable/update-user';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {documentDeleted} from './triggers/document-deleted';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {impersonate} from './callable/impersonate';
import {userDocumentUpdated} from './triggers/user-document-updated';
import {documentWrite} from './triggers/document-write';
import {proxy} from './rest/proxy';
import {fileMetadataUpdated} from './triggers/file-metadata-updated';
import {statusUpdated} from './triggers/status-updated';

initializeApp();

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
  statusUpdated,

  // Callable
  createUser,
  removeUser,
  updateUser,
  getUser,
  updateEmail,
  exchangeToken,
  impersonate,

  // Rest
  exportData,
  importData,
  proxy
};
