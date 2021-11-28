import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';
import { firestore } from './db';
import { collectionIndex } from "./main";

export const discountsOnUpdate = functions.firestore.document('discounts/{uid}').onUpdate(async (change, context) => {
  await updateDocumentInAlgolia(change);
});

/**
 * @description Update discounts in Algolia
 *
 * @param {functions.Change<FirebaseFirestore.DocumentSnapshot>} change
 */
async function updateDocumentInAlgolia(change: functions.Change<FirebaseFirestore.DocumentSnapshot>) {
  const docAfterChange = change.after.data();
  const discount = docAfterChange; // Get the discount document
  if (discount && isDiscountValid(discount)) {
    await saveDocumentInAlgolia(discount);
  } else {
    console.log("Invalid Discount: ", discount?.id);
  }
}

/**
 * @description Generic method to pass and save discounts in Algolia
 *
 * @param {*} snapshot
 */
async function saveDocumentInAlgolia(discount: any) {
  let discountObj = {};
  const buddyRef = firestore.doc(discount.bd_ref.path);

  await buddyRef.get().then(function (buddy) {
    if (buddy.exists) {
      discountObj = {
        objectID: discount.id,
        subCtg: discount.subCtg,
        isOnline: discount.isOnline,
        isSpons: discount.isSpons,
        dateCreated: discount.dateCreated._seconds,
        buddy: buddy.data()?.name
      };
      console.log("Sending discount: ", discount.id);
    }
  }).catch(function (error) {
    console.log("Error getting document with :" + discount.id, error);
  });

  // In this example, we are including all properties of the Firestore document 
  // in the Algolia record, but do remember to evaluate if they are all necessary.
  // More on that in Part 2, Step 2 above.
  await collectionIndex.saveObject(discountObj); // Adds or replaces a specific object.
}


/**
   * @description Check if each required property exists in discounts
   *
   * @param {*} discount
   * @returns {boolean}
   */
function isDiscountValid(dct: any): boolean {

  if (dct.hasOwnProperty(Constants.algoliaAtrSubCtg)
    && dct.hasOwnProperty(Constants.bd_ref)
    && dct.hasOwnProperty(Constants.algoliaAtrType)
    && dct.hasOwnProperty(Constants.algoliaAtrIsSpons)
    && dct.hasOwnProperty(Constants.algoliaAtrDateCreated)) {
    return true;
  }

  return false;
}