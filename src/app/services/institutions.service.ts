import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentData, Query, CollectionReference } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs/internal/Observable";
import { Constants } from "../shared/utils/constants";
import { take, map } from "rxjs/operators";
import { Region } from "../models/region";
import { Institution } from "../models/institution";

@Injectable({
  providedIn: "root"
})
export class InstitutionsService {

  constructor(private angularFirestore: AngularFirestore) { }

  /**
   * @description Retrieve available Region for Stubud services
   *
   * @returns {Observable<Region[]>}
   * @memberof InstitutionsService
   */
  public retrieveAvailableRegions$(): Observable<Region[]> {
    return this.angularFirestore.collection(Constants.fbPathRefRegionsNode,
      (queryFn: CollectionReference | Query)
        : CollectionReference | Query =>
        queryFn = queryFn.where("isStubudAvbl", "==", true)).valueChanges()
      .pipe(
        take(Constants.numberValue_One),
        map((actions: Region[]): Region[] => { // Only 1 array is returned
          return actions.map((action: Region): Region => action as Region);
        })
      );
  }

  /**
   * @description Retrieve available Institution for @param regionId provided for Stubud services.
   *
   * @param {string} regionId
   * @returns {Observable<Institution[]>}
   * @memberof InstitutionsService
   */
  public retrieveAvailableInstitutions$(regionId: string): Observable<Institution[]> {
    return this.angularFirestore.collection(Constants.fbPathRefInstitutionsNode,
      (queryFn: CollectionReference | Query)
        : CollectionReference | Query =>
        queryFn = queryFn.where("alpha_two_code", "==", regionId).where("isStubudAvbl", "==", true)).valueChanges()
      .pipe(
        take(Constants.numberValue_One),
        map((actions: Institution[]): Institution[] => { // Only 1 array is returned
          return actions.map((action: Institution): Institution => action as Institution);
        })
      );
  }

  public retrieveInstitution$(insId: string): Observable<Institution> {
    return this.angularFirestore.collection(Constants.fbPathRefInstitutionsNode).doc(insId).valueChanges()
      .pipe(
        take(Constants.numberValue_One),
        map((action: Institution): Institution => {
          return action as Institution;
        })
      );
  }

  public isInsEmailUsed(uid: string, email: string): Observable<boolean> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode,
      (queryFn: CollectionReference | Query)
        : CollectionReference<DocumentData>
        | Query<DocumentData> => {

        queryFn = queryFn.where(Constants.uid, Constants.notEquals, uid).where(Constants.insEmail, Constants.equals, email);
        return queryFn;
      }
    ).valueChanges().pipe(
      take(Constants.numberValue_One),
      map((payload: any[]): boolean => payload.length !== 0 ? true : false)
    );
  }
}
