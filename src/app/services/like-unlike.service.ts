import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument, QuerySnapshot, DocumentData, CollectionReference, Query } from "@angular/fire/compat/firestore";
import { Constants } from "../shared/utils/constants";
import { Observable, of } from "rxjs";
import { map, take } from "rxjs/operators";

import { documentId, increment, deleteField } from "firebase/firestore";

/* @Injectable - Indicate that a component or other class (such as another service, a pipe, or an NgModule) has a dependency.
At the same time, for good practice, add the Injectable decorator to indicate this class is a service.
 */
/**
 * @description Persist like and unlike of discounts on DB
 *
 * @export
 * @class LikeUnlikeService
 */
@Injectable({
  providedIn: "root" // We declare that this service should be created by the root application injector. // root level (AppModule) Provided to any class that imports this service
})
export class LikeUnlikeService {

  likeDocRef: AngularFirestoreDocument<any>;

  private userId: string;

  /**
   * @description Is service activated or not. Service will be deactivated for guest user or not validated user
   *
   * @private
   * @type {boolean}
   * @memberof LikeUnlikeService
   */
  private activated: boolean;

  constructor(private angularFirestore: AngularFirestore) {
  }

  /**
   * @description Like Discount and Increment count
   *
   * @param {string} discountID
   * @returns {Promise<boolean>}
   * @memberof LikeUnlikeService
   */
  public likeDiscount(discountID: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any): any => {
      if (this.activated) {
        Promise.all(
          [this.angularFirestore.collection(Constants.fbPathRefLikesNode).doc(this.userId).set({ [discountID]: true }, { merge: true }),
          this.incrementLikeCount(discountID)])
          .then((): void => {
            resolve(true); // Incremented Discount count and store like on User
          }).catch((error: any): any => {
            console.error(error);
            reject(error); // Unable to increment Discount count and store like on User
          });
      } else {
        reject(false); // Service not activated
      }
    });
  }

  /**
   * @description Unlike discount and decrement discount like count
   *
   * @param {string} discountID
   * @returns {Promise<boolean>}
   * @memberof LikeUnlikeService
   */
  public unlikeDiscount(discountID: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any): any => {
      if (this.activated) {
        Promise.all(
          [this.angularFirestore.collection(Constants.fbPathRefLikesNode)
            .doc(this.userId).update({[discountID]: deleteField()}), // TODO Test after upgrade
          this.decrementLikeCount(discountID)])
          .then((): void => {
            resolve(true); // Decremented Discount count and delete like on User
          }).catch((error: any): any => {
            console.error(error);
            reject(error); // Unable to decrement Discount count and delete like on User
          });
      } else {
        reject(false); // Service not activated
      }
    });
  }

  // public isDiscountLiked(discountID: string): boolean {
  //   let isDiscountLiked: boolean = false;
  //   this.isLikeExistOnDb(discountID).subscribe((doc: QuerySnapshot<FirebaseFirestore.DocumentData>) => {
  //     isDiscountLiked = !(!!doc.empty);
  //     console.log("In subscription", isDiscountLiked);
  //   });
  //   console.log("Bellow subscription", isDiscountLiked);
  //   return isDiscountLiked;
  // }

  public isLikeExistOnDb(discountID: string): Observable<QuerySnapshot<DocumentData> | boolean> {
    if (this.activated) {
      return this.angularFirestore.collection(Constants.fbPathRefLikesNode,
        (queryFn: CollectionReference | Query): any => queryFn
          .where(documentId(), Constants.equals, this.userId)
          .where(discountID, Constants.equals, true)).get().pipe(take(Constants.numberValue_One));
    } else {
      return of(false);
    }

  }

  /**
   * @description Set the User Id of the User and activate Service
   * @param {string} userId
   * @member setUserId
   * @memberof LikeUnlikeService
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    this.activated = true;
  }

  /**
   * @description Deactivate Service
   * @member deactivateService
   * @memberof LikeUnlikeService
   */
  public deactivateService(): void {
    this.userId = null;
    this.activated = false;
  }

  /**
   * @description Increment Like count of Discount
   * @param {string} discountID
   * @member incrementLikeCount
   * @memberof LikeUnlikeService
   */
  public incrementLikeCount(discountID: string): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode).doc(discountID).update({
      likeCnt: increment(1)
    });
  }

  /**
   * @description Decrement Like count of Discount*
   * @param {string} discountID
   * @member decrementLikeCount
   * @memberof LikeUnlikeService
   */
  public decrementLikeCount(discountID: string): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode).doc(discountID).update({
      likeCnt: increment(-1)
    });
  }

  /**
   * @description Retrieve discounts id liked by user
   *
   * @returns {Observable<string[]>}
   * @memberof LikeUnlikeService
   */
  public retrieveLikedDiscountsId(): Observable<string[]> {
    return this.angularFirestore.collection(Constants.fbPathRefLikesNode).doc(this.userId).valueChanges()
      .pipe(
        take(Constants.numberValue_One),
        map((payload: any): string[] => {
          return (!!payload) ? Object.keys(payload) : []; // Map to an array of discount's Id only
        })
      );
  }

}
