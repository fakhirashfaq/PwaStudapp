import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from './db';
import { Constants } from '../../src/app/shared/utils/constants';
import { collectionIndex } from "./main";

export const scheduledFuncDiscountCleanup = functions.pubsub.schedule('every day 01:01')
  // .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {

    // Consistent timestamp
    const now = admin.firestore.Timestamp.now();

    // Query all documents ready to perform
    const query = firestore.collection(Constants.fbPathRefDiscountsNode)
      .where(Constants.endDate, Constants.smallerEqualThan, now)
      .where(Constants.isArch, Constants.equals, false);

    const discounts = await query.get();

    // Jobs to execute concurrently. 
    const jobs: Promise<any>[] = [];

    if (discounts.size !== Constants.numberValue_Zero) {
      discounts.forEach((discount) => {
        const dcId = discount.id;
        // const dcData = discount.data();
        console.info("Archiving discount: ", dcId);
        jobs.push(firestore.collection(Constants.fbPathRefDiscountsNode).doc(dcId).update({
          isArch: true
        }));
        jobs.push(archiveCarouselItem(dcId));
        jobs.push(archDocumentInAlgolia(dcId))
      })

      await Promise.all(jobs).then(() => {
        console.info(discounts.size + " Discounts archived.");
        return Promise.resolve();
      }).catch((error) => {
        console.error("Failed archiving discounts.");
        console.error(error);
        return Promise.reject(error);
      });

    } else {
      console.info("No Discounts to archive.")
    }

    return Promise.resolve();
  });

async function archiveCarouselItem(dcId: string): Promise<void> {
  const carouselItem = await firestore.collection(Constants.fbPathRefUsedCarouselNode).doc(dcId).get();
  if (carouselItem.exists) {
    console.info("Archiving carousel item for discount: " + dcId);
    await firestore.collection(Constants.fbPathRefUsedCarouselNode).doc(dcId).update({
      isArch: true
    }).then(() => {
      console.info("Carousel item: " + dcId + " archived.")
      return Promise.resolve()
    }).catch((error: any) => {
      console.error("Failed archiving Carousel Item: " + dcId);
      console.error(error);
      return Promise.reject(error);
    })
  } else {
    return Promise.resolve();
  }
}

/**
 * @description Archive discount at algolia
 *
 * @param {string} dcId
 */
async function archDocumentInAlgolia(dcId: string) {

  const discountObj = {
    objectID: dcId,
    isArch: true
  };

  await collectionIndex.partialUpdateObject(discountObj)
    .then(() => {
      console.info("Discount archived in Algolia: ", dcId)
      return Promise.resolve();
    }).catch((error: any) => {
      console.error("Failed to archive Discount in Algolia", dcId);
      return Promise.reject(error);
    }); // Update Discount
}
