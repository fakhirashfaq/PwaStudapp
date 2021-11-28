import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
const firebase_tools = require('firebase-tools');

// const project = process.env.GCLOUD_PROJECT;
// const token = functions.config().ci.token;

export const discountsOnDelete = functions.firestore.document('discounts/{uid}').onDelete(async (snapshot, context) => {
    await deleteVoucherColl(snapshot);
});

async function deleteVoucherColl(snapshot: FirebaseFirestore.DocumentSnapshot) {
    if (snapshot.exists) {
        const dcId = snapshot.id;
        const path = Constants.fbPathRefDiscountsNode + Constants.slash + dcId + Constants.fbPathRefVcodesNode
        console.log(path)
        await firebase_tools.firestore
            .delete(path, {
                // process: process.env.GCLOUD_PROJECT,
                project: "stubud-bb83b",
                recursive: true,
                yes: true
                // token: functions.config().ci.token
            })
            .then(() => {
                console.info("Vcodes collection deleted for discount: " + dcId);
            })
            .catch((error: any) => {
                console.error("Cannot delete vcodes from discount: " + dcId);
                console.error(error);
            });
    }
}