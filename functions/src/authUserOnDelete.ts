import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore } from './db';

/**
 * @description Delete User doc in DB. Triggered by deleteUserAcc
 */
export const authUserOnDelete = functions.auth.user().onDelete(async (user) => {
    await deleteUserInDB(user.uid);
});


async function deleteUserInDB(userId: string) {
    await firestore.collection(Constants.fbPathRefUsersNode).doc(userId).delete().then(() => {
        console.info(`User ${userId} manually deleted from DB`)
        return Promise.resolve();
    }).catch((error: any) => {
        console.error(`Error manually deleting user ${userId} from DB: ${error}`);
        return Promise.reject(error);
    });
}