import {firestore} from 'firebase-admin';
import functions from 'firebase-functions';

export function isAuthenticated(
  context: functions.https.CallableContext,
  message = 'The operation must be called while authenticated.'
) {
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError('failed-precondition', message);
  }
}

/**
 * Checks if the user is authenticated and
 * has any of the provided roles. If no role is provided
 * we check if the user has any role at all.
 */
export function hasRole(
  context: functions.https.CallableContext,
  roles: string | string[] = [],
  message = `You don't have permission to perform this operation.`
) {
  const check = (typeof roles === 'string' ? [roles] : roles);

  isAuthenticated(context);

  // @ts-ignore
  const {role} = context.auth.token

  if (!role || (check.length && !check.includes(role))) {
    throw new functions.https.HttpsError('failed-precondition', message);
  }
}

export async function hasPermission(
  context: functions.https.CallableContext,
  module: string, 
  permission: 'get' | 'list' | 'create' | 'update' | 'delete',
  message = `You don't have permission to perform this operation.`
) {

  isAuthenticated(context);

  const permissions = (await firestore().doc(['users', context.auth.uid, 'authorization', 'permissions'].join('/')).get()).data();

  if (!permissions?.[module]?.[permission]) {
    throw new functions.https.HttpsError('failed-precondition', message);
  }
}