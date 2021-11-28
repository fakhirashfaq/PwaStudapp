import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore } from './db';
import * as admin from 'firebase-admin';

/**
 * @description Validate user 100% from request from Email verification
 * @summary req will be as follows:
 * "https://us-central1-stubud-bb83b.cloudfunctions.net/validateUserAcc/" + Users.uid + "/" + Date.now();
 *
 */
export const validateUserAcc = functions.https.onRequest((req, res) => {

    const urlValues: string[] = req.originalUrl.split(Constants.slash);

    if (!isReqValuesValid(urlValues)) { // Invalid request parameters
        console.info("Invalid request passed. Request: ", req.originalUrl);
        res.sendStatus(404).end();
        return;
    }

    return firestore.collection(Constants.fbPathRefUsersNode).doc(urlValues[1]).update({
        accValidity: 100,
        isAccValid: true,
        regDate: admin.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.info("User " + urlValues[1] + " validated.");
        res.redirect("https://email-verified.web.app/");
    }).catch((error: any) => {
        console.error("Failed to update user " + urlValues[1] + ".", error)
        res.status(500).end()
    })
});

/**
 * @description Check if request contains necessary values
 *
 * @param {string[]} requestValues
 * @return {*}  {boolean}
 */
function isReqValuesValid(requestValues: string[]): boolean {
    return !!requestValues[1] ? true : false;
}