import {initializeApp} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {exchangeToken} from './callable/exchange-token';
import {getUser} from './callable/get-user';
import {removeUser} from './callable/remove-user';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateEmail} from './callable/update-email';
import {updateUser} from './callable/update-user';
import {api} from './rest/api';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {documentDeleted} from './triggers/document-deleted';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {impersonate} from './callable/impersonate';
import {userDocumentDeleted} from './triggers/user-document-deleted';
import {userDocumentUpdated} from './triggers/user-document-updated';

declare global {
  interface Window {
    jms: {
      util: any
    };
  }
}

initializeApp();

export {actionController} from './standalone/action-controller';

export const cms = {
  // Triggers
  userCreated,
  userDeleted,
  userDocumentUpdated,
  userDocumentDeleted,
  fileCreated,
  fileDeleted,
  documentDeleted,
  triggerPasswordReset,

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
  api
};
