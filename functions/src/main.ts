/**
 *  main.ts deals with initialization. 
 * 
 */

/* The Firebase Admin Node.js SDK enables access to Firebase services from privileged environments (such as servers or cloud) in Node.js */
import * as admin from 'firebase-admin';

import { environment } from "../../src/environments/environment";

import algoliasearch from 'algoliasearch';
import { Constants } from '../../src/app/shared/utils/constants';

// Init for Firestore.
admin.initializeApp(); // Initialize the Firebase Admin SDK

// Set up Algolia client
// The app id and API key are coming from the cloud functions environment, as we set up in Part 1, Step 3.
const algoliaClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey, {
  timeouts: {
    connect: 540,
    read: 540,
    write: 540
  }
});

// Init for Algolia.
export const collectionIndex = algoliaClient.initIndex(Constants.fbPathRefDiscountsNodeNm);
