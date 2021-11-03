import {initializeApp} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {getUser} from './callable/get-user';
import {removeUser} from './callable/remove-user';
import {sampleEmail} from './callable/sample-email';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateEmail} from './callable/update-email';
import {updateUser} from './callable/update-user';
import {actionController} from './rest/action-controller';
import {api} from './rest/api';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {documentDeleted} from './triggers/document-deleted';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {formSubmissionCreated} from './triggers/form-submission-created';
import {updateDynamicOnCreate} from './triggers/update-dynamic-on-create';
import {updateDynamicOnUpdate} from './triggers/update-dynamic-on-update';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {userDocumentDeleted} from './triggers/user-document-deleted';
import {userDocumentUpdated} from './triggers/user-document-updated';

initializeApp();

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
  formSubmissionCreated,

  updateDynamicOnCreate,
  updateDynamicOnUpdate,

  // Callable
  createUser,
  removeUser,
  updateUser,
  getUser,
  updateEmail,
  sampleEmail,

  // Rest
  exportData,
  importData,
  api,
  actionController
};
