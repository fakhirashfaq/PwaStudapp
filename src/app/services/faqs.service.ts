import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { increment } from "firebase/firestore";
import { Observable, take } from "rxjs";
import { Constants } from "../shared/utils/constants";

@Injectable()
export class FaqsService {

  constructor(private angularFirestore: AngularFirestore) { }

  /**
   * @description Fetch feedback doc from DB
   *
   * @returns {Observable<any>}
   * @memberof FaqsService
   */
  public fetchFeedbackVal(): Observable<any> {
    return this.angularFirestore.doc(Constants.fbPathRefFaqsFeedbackDoc).valueChanges().pipe(take(Constants.numberValue_One));
  }

  /**
   * @description Increment likes value in DB
   *
   * @returns {Promise<void>}
   * @memberof FaqsService
   */
  public incrementVal(): Promise<void> {
    return new Promise((resolve: any, reject: any): void => {
      this.angularFirestore.doc(Constants.fbPathRefFaqsFeedbackDoc).update({
        likes: increment(1)
      }).then((): void => {
        resolve();
      }).catch((error: any): void => {
        console.error(error);
        reject(error);
      });
    });
  }

  /**
   * @description Increment dislikes value in DB
   *
   * @returns {Promise<void>}
   * @memberof FaqsService
   */
  public decrementVal(): Promise<void> {
    return new Promise((resolve: any, reject: any): void => {
      this.angularFirestore.doc(Constants.fbPathRefFaqsFeedbackDoc).update({
        dislikes: increment(1)
      }).then((): void => {
        resolve();
      }).catch((error: any): void => {
        console.error(error);
        reject(error);
      });
    });
  }

}
