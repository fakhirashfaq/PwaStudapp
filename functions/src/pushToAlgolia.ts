import * as functions from 'firebase-functions';
import { collectionIndex } from "./main";

/**
 * @description Cloud function to push discount to Algolia onCreate
 *
 * @param {*} snapshot
 */
export const pushToAlgolia = functions.firestore.document('discounts/{uid}').onCreate(async (snapshot, context) => {
    await saveDocumentInAlgolia(snapshot.data()).then(() => {
        console.log("Discount uploaded to Algolia: " + snapshot.data().id)
    }).catch((error: any) => {
        console.log("Failed to upload to Algolia, Discount: " + snapshot.data().id, error)
    })
});

/**
 * @description Create discount obj and save to Algolia
 *
 * @param {*} snapshot
 */
async function saveDocumentInAlgolia(discount: any) {

    const discountObj = {
        objectID: discount.id,
        subCtg: discount.subCtg,
        type: discount.type,
        isSpons: discount.isSpons,
        dateCreated: discount.dateCreated,
        buddy: discount.bdNm,
        _tags: discount.tags
    };

    // In this example, we are including all properties of the Firestore document 
    // in the Algolia record, but do remember to evaluate if they are all necessary.
    // More on that in Part 2, Step 2 above.
    await collectionIndex.saveObject(discountObj); // Adds or replaces a specific object.
}