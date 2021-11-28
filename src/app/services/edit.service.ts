import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireFunctions } from "@angular/fire/compat/functions";
import { Constants } from "../shared/utils/constants";

@Injectable({
  providedIn: "root"
})
export class EditService {

  constructor(private angularFirestore: AngularFirestore, private angularFireFunctions: AngularFireFunctions) { }

  /**
   * @description Persist user details in DB
   *
   * @param {string} uid
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   *
   * @summary
   * 1. (^\w{1}): match first char of string
   * 2. |: or
   * 3. (\s{1}\w{1}): match one char that came after one space
   * 4. g: match all
   * 5. match => match.toUpperCase(): replace with can take function, so; replace match with upper case match
   */
   public updateUserDetails(uid: string, userInputs: any): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(uid).update({
      firstName: userInputs.fNameFormC.replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string): string => match.toUpperCase()),
      lastName: userInputs.lNameFormC.replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string): string => match.toUpperCase()),
      dOB: new Date(userInputs.dobMonthFormC + Constants.slash + userInputs.dobDayFormC + Constants.slash + userInputs.dobYearFormC),
      gender: userInputs.genderFormC
    });
  }

  /**
   * @description Persist user institution details in DB
   * @summary 
   * 1. Set validity to 60
   * 2. Set Acc validity to false
   * 3. Remove user ins email
   *
   * @param {string} uid
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
   public updateInstitutionDetails(uid: string, userInputs: any): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(uid).update({
      regId: userInputs.regionFormC,
      insId: userInputs.institutionFormC,
      gradYr: userInputs.gradYrFormC,
      accValidity: Constants.numberValue_Sixty,
      isAccValid: false,
      insEmail: null
    });
  }

  /**
   * @description Add the user's institution email to DB and set user validity to 80
   * @description Trigger sendVerifyInsMail functions to send mail
   *
   * @param {string} uid
   * @param {string} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
   public updateInstitutionEmailAddress(uid: string, userInputs: string): Promise<void[]> {
    return Promise.all([
      this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(uid).update({
        insEmail: userInputs,
        accValidity: Constants.numberValue_Eighty,
        isAccValid: false
      }),
      this.angularFireFunctions.httpsCallable(Constants.cloudFunctionSendVerifyInsMail)({ id: uid }).toPromise()
    ]);
  }

  /**
   * @description Add Matriculation number to DB
   *
   * @param {string} uid
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
   public updateMatNm(uid: string, userInputs: any): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(uid).update({
      stdMatNum: userInputs.stdMNmFormC
    });
  }

  /**
   * @description Delete profile pic from DB
   *
   * @param {*} uid
   * @returns {Promise<void>}
   * @memberof EditService
   */
  public deleteProfPic(uid): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(uid).update({
      profilePic: null
    })
  }

}
