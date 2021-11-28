import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * @description Delete User Account on User's request from Client
 * @summary deleteUserAcc will delete the user in Authentication only.
 * Once triggered and deleted, authUserOnDelete CF will be triggered in turn triggering  userOnDelete for other user's data
 */
export const deleteUserAcc = functions.https.onCall(async (data, context) => {

  const userId: string = data.userId;

  if (!(!!userId)) { // Invalid request parameters
    console.error("No user Id provided");
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a user ID.');
  }

  await admin.auth().deleteUser(userId).then(() => {
    console.info("User account deleted on user request. User: ", userId);
    return Promise.resolve();
  }).catch((error: any) => {
    console.error("Error deleting user account on user request. User: ", userId);
    console.error(error);
    throw new functions.https.HttpsError('internal', "An error occurred while trying to delete user" + userId);
  })

});
