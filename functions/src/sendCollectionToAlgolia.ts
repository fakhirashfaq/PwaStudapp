import * as functions from 'firebase-functions';
import { Constants } from '../../src/app/shared/utils/constants';

import { firestore } from './db';
import { collectionIndex } from './main';

export const sendCollectionToAlgolia = functions.https.onRequest(async (req, response) => {

  // This array will contain all records to be indexed in Algolia.
  // A record does not need to necessarily contain all properties of the Firestore document,
  // only the relevant ones. 
  const algoliaRecords: any[] = [];

  // Retrieve all documents from the discounts collection.
  const querySnapshot = await firestore.collection(Constants.fbPathRefDiscountsNode).get();

  querySnapshot.docs.forEach(async (doc) => {
    const document = doc.data();
    // Essentially, you want your records to contain any information that facilitates search, 
    // display, filtering, or relevance. Otherwise, you can leave it out.
    const buddyRef = await firestore.doc(document.bd_ref.path);

    buddyRef.get().then(function (buddy) {
      if (buddy.exists) {

        const discount = {
          objectID: document.id,
          subCtg: document.subCtg,
          isOnline: document.isOnline,
          isSpons: document.isSpons,
          dateCreated: document.dateCreated,
          buddy: buddy.data()?.name
        };

        algoliaRecords.push(discount);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document with :" + document.id, error);
    });

  });

  // After all records are created, we save them to 
  collectionIndex.saveObjects(algoliaRecords, (_error: any, content: any) => {
    response.status(200).send("COLLECTION was indexed to Algolia successfully.");
  });

})