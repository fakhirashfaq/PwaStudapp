import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore, storage } from './db';

/**
 * @description Delete User's likes and profile picture in DB. Triggered from authUserOnDelete
 */
export const userOnDelete = functions.firestore.document('users/{uid}').onDelete(async (snapshot, context) => {
    if (snapshot.exists) {
        await deleteUserLikesInDB(snapshot);
        await deleteUserProfsFromStorage(snapshot);
    }
});


async function deleteUserLikesInDB(snapshot: FirebaseFirestore.DocumentSnapshot) {
    await firestore.collection(Constants.fbPathRefLikesNode).doc(snapshot.id).delete().then(() => {
        console.info(`User ${snapshot.id}'s likes deleted from DB`);
        return Promise.resolve();
    }).catch((error: any) => {
        console.error(`Error deleting user ${snapshot.id}'s likes from DB: ${error}`);
        return Promise.reject(error);
    });
}

async function deleteUserProfsFromStorage(snapshot: FirebaseFirestore.DocumentSnapshot) {
    const path: string = Constants.stoPathRefProfilePicsNodeNm + Constants.slash + snapshot.id;
    await storage.bucket().file(path).delete().then(() => {
        console.info(`User ${snapshot.id}'s profile pics deleted from Storage`);
        return Promise.resolve();
    }).catch((error: any) => {
        if (404 === error.code) {
            console.info("No profile pic to delete.");
            return Promise.resolve();
        } else {
            console.error(`Error deleting user ${snapshot.id}'s profile pics from Storage: ${error}`);
            return Promise.reject(error);
        }
    })
}