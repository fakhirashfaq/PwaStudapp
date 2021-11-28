import {Injectable} from "@angular/core"; // Import Injectable decorator to use it in this class
import {Observable} from "rxjs";
import {Buddy} from "../models";
import { DocumentReference, AngularFirestore} from "@angular/fire/compat/firestore";
import { take } from "rxjs/operators";
import { Constants } from "../shared/utils/constants";

/* Indicate that a component or other class (such as another service, a pipe, or an NgModule) has a dependency.
At the same time, for good practice, add the Injectable decorator to indicate this class is a service.
 */
@Injectable({
  providedIn: "root" // We declare that this service should be created by the root application injector. // root level (AppModule) Provided to any class that imports this service
})
export class BuddyService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  /**
   * @description Retrieve Buddy document from DB
   * @param {DocumentReference} bd_ref
   * @private
   * @returns {Observable<Buddy>}
   * @member getBuddyColFromFt$
   * @memberof BuddyService
   */
  public getBuddyCollFromDB$(bd_ref: DocumentReference): Observable<Buddy> {
    return this.angularFirestore.doc<Buddy>(bd_ref.path).valueChanges().pipe(take(Constants.numberValue_One));
  }


}
