import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {deleteCollection} from '../utils/delete-collection';

export const documentDeleted = functions
  .region(STATIC_CONFIG.cloudRegion)
  .firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {
    const firestore = admin.firestore();
    const {moduleId, documentId} = context.params;

    const subcollections = ['medications'];

    for (const collection of subcollections) {
      await deleteCollection(
        firestore,
        `${moduleId}/${documentId}/${collection}`,
        100
      );
    }
  });
