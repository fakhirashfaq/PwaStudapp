import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore } from './db';
import * as admin from 'firebase-admin';

/**
 * @description Validate voucher codes
 *
 */
export const validateVcode = functions.https.onRequest(async (req, res) => {

    // const request = "https://us-central1-stubud-bb83b.cloudfunctions.net/validateVcode/" + bdId + / + voucherCode;

    const urlValues: string[] = req.originalUrl.split(Constants.slash);

    if (!isReqValuesValid(urlValues)) { // Invalid request parameters
        console.error("Invalid request passed. Request: ", req);
        console.error("Invalid request passed. Request originalUrl: ", req.originalUrl);
        res.sendStatus(404).end();
        return;
    }

    const bdId = urlValues[1];
    const voucherCode = urlValues[2];

    const ogVcodesGenCodeSnapshot = await firestore.collection(Constants.fbPathRefOnGoingVcodesNode).doc(bdId)
        .collection(Constants.genCode).where(voucherCode, "==", true).get();

    if (!ogVcodesGenCodeSnapshot.empty) {
        if (ogVcodesGenCodeSnapshot.docs.length > Constants.numberValue_One) {
            console.error("2 identical vouchers found." + " Buddy Id: " + bdId + ", Voucher code: ", voucherCode);
            res.sendStatus(404).end();
            return;
        }
        ogVcodesGenCodeSnapshot.forEach(async (docSnapshot) => {
            const discountSnapshot = await firestore.collection(Constants.fbPathRefDiscountsNode).doc(docSnapshot.id).get();
            disableCode(bdId, docSnapshot.id, voucherCode);
            console.info("Buddy: " + bdId + ", Discount: " + docSnapshot.id + " , vCode: " + voucherCode + " validated");
            res.status(200).send(Constants.empty + discountSnapshot.get(Constants.dcPct));
        })
    } else {
        // ERROR this discount was not used or doesn't exist
        console.warn("Buddy ID: " + bdId + ", Voucher Code: " + voucherCode + " rejected");
        res.sendStatus(404).end();
    }
});


/**
   * @description Set voucher code to false.
   * @summary Cloud function will trigger to delete it after
   * @private
   * @param {string} bdId
   * @param {string} id
   * @param {string} vcode
   * @memberof VcodeService
   */
function disableCode(bdId: string, id: string, vcode: string): void {
    Promise.all(
        [firestore.collection(Constants.fbPathRefUsedVcodesNode).doc(id).set({
            [vcode]: false
        }, { merge: true }),
        firestore.collection(Constants.fbPathRefOnGoingVcodesNode).doc(bdId).collection(Constants.genCode).doc(id).update({
            [vcode]: admin.firestore.FieldValue.delete()
        })]
    )
        .then(() => console.log("Buddy: " + bdId + ", Discount: " + id + ", vCode: " + vcode + " disabled."))
        .catch((error) => console.error("Unable to disable vCode." + " Buddy: " + bdId + ", Discount: " + id + ", vCode: " + vcode, (error)));
}

/**
 * @description Check if request contains necessary values
 *
 * @param {string[]} requestValues
 * @return {*}  {boolean}
 * @summary
 * requestValues[1] = bdId
 * requestValues[2] = voucher
 * 
 */
function isReqValuesValid(requestValues: string[]): boolean {
    return !!requestValues[1] && !!requestValues[2] ? true : false;
}