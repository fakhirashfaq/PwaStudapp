import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentData, CollectionReference, Query } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { Constants } from "../shared/utils/constants";
import { Timestamp } from "firebase/firestore";

@Injectable({
  providedIn: "root"
})
export class VcodeService {

  constructor(private angularFirestore: AngularFirestore) { }

  /**
   * @description Retrieve discount's voucher codes
   *
   * @private
   * @param {string} id
   * @returns {Observable<any>}
   * @memberof VcodeService
   */
  private retrieveVcodes(id: string): Observable<any> {
    return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode).doc(id).collection(Constants.fbPathRefVcodesNode,
      (queryFn: CollectionReference | Query):
        CollectionReference<DocumentData>
        | Query<DocumentData> => {
        return queryFn.limit(Constants.numberValue_One);
      })
      .valueChanges({ idField: Constants.vUid }).pipe(take(Constants.numberValue_One));
  }

  /**
   * @description Return one voucher code for a discount or null if none
   *
   * @param {string} dcId Discount Id
   * @param {string} userId
   * @param {string} bdId
   * @returns {Observable<string>}
   * @memberof VcodeService
   */
  public getCode(dcId: string, userId: string, bdId: string): Promise<string> {
    return this.retrieveVcodes(dcId).pipe(
      map((payload: string[]): string => {
        if (payload.length !== Constants.numberValue_Zero) {
          this.disableCode(dcId,
            Object.keys(payload[Constants.numberValue_Zero])[Constants.numberValue_Zero],
            payload[Constants.numberValue_Zero][Constants.vUid], bdId);
          this.recordUser(userId, dcId);
          return Object.keys(payload[Constants.numberValue_Zero])[Constants.numberValue_Zero];
        } else {
          return null;
        }
      })
    ).toPromise();
  }

  /**
   * @description Set voucher code to false.
   * @summary Cloud function will trigger to delete it after
   * @private
   * @param {string} id Discount Id
   * @param {string} vcode
   * @param {string} vUid Voucher Id
   * @param {string} bdId Voucher Id
   * @memberof VcodeService
   */
  private disableCode(id: string, vcode: string, vUid: string, bdId: string): void {
    this.angularFirestore.collection(Constants.fbPathRefOnGoingVcodesNode).doc(bdId).collection(Constants.genCode).doc(id).set({
      [vcode]: true
    }, { merge: true });
    this.angularFirestore.collection(Constants.fbPathRefDiscountsNodeNm).doc(id)
      .collection(Constants.fbPathRefVcodesNode).doc(vUid).delete();
  }

  /**
   * @description Record time user generated code
   * @private
   * @param {string} userId
   * @param {string} dcId
   * @memberof VcodeService
   */
  private recordUser(userId: string, dcId: string): void {
    this.angularFirestore.collection(Constants.fbPathRefEpheVcodesData).doc(userId).collection(Constants.genCode).doc(dcId).set({
      lastGeneCode: Timestamp.now(), // TODO Test after upgrade
      uid: userId,
      dcId: dcId
    });
  }

  /**
   * @description Check against last time user generated a code. User can generated a code each 30mins only
   *
   * @param {string} userId
   * @param {string} dcId
   * @returns {Promise<boolean>}
   * @memberof VcodeService
   */
  public isAllowedToGenerate(userId: string, dcId: string): Promise<boolean> {
    return this.angularFirestore.collection(Constants.fbPathRefEpheVcodesData).doc(userId).collection(Constants.genCode,
      (queryFn: CollectionReference | Query)
        : CollectionReference<DocumentData>
        | Query<DocumentData> => {

        const tsToMillis: number = Timestamp.now().toMillis(); // TODO Test After upgrade
        const compareDate: Date = new Date(
          tsToMillis - (Constants.numberValue_Ten * Constants.numberValue_Sixty * Constants.numberValue_Thousand)
        );

        queryFn = queryFn
        .where(Constants.uid, Constants.equals, userId)
        .where(Constants.dcId, Constants.equals, dcId)
        .where(Constants.lastGeneCode, Constants.greaterThan, compareDate);
        return queryFn;
      })
      .valueChanges().pipe(
        take(Constants.numberValue_One),
        map((payload: any[]): boolean => payload.length === 0 ? true : false)
      ).toPromise();
  }
}
