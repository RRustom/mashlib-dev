/**
 * Re-exports all the exports from the various files in the src/authn/ folder
 * @packageDocumentation
 */

import {
  checkUser, // Async
  currentUser, // Sync
  defaultTestUser, // Sync
  filterAvailablePanes, // Async
  findAppInstances,
  findOriginOwner,
  getUserRoles, // Async
  loadTypeIndexes,
  logIn,
  logInLoadProfile,
  logInLoadPreferences,
  loginStatusBox,
  newAppInstance,
  offlineTestID,
  registerInTypeIndex,
  registrationControl,
  registrationList,
  selectWorkspace,
  setACLUserPublic,
  saveUser,
  solidAuthClient
} from './authn'

export const authn = {
  checkUser, // Async
  currentUser, // Sync
  defaultTestUser, // Sync
  filterAvailablePanes, // Async
  findAppInstances,
  findOriginOwner,
  getUserRoles, // Async
  loadTypeIndexes,
  logIn,
  logInLoadProfile,
  logInLoadPreferences,
  loginStatusBox,
  newAppInstance,
  offlineTestID,
  registerInTypeIndex,
  registrationControl,
  registrationList,
  selectWorkspace,
  setACLUserPublic,
  saveUser,
  solidAuthClient
}
