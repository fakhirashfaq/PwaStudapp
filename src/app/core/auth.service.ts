import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "../models/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { switchMap, take } from "rxjs/operators";
import { Constants } from "../shared/utils/constants";
import { LikeUnlikeService } from "../services/like-unlike.service";
import { AngularFireFunctions } from "@angular/fire/compat/functions";

// import "firebase/auth";

// import * as firebase from 'firebase/app';
// import * as auth from 'firebase/auth'
import {
  User as FireUser,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth, GoogleAuthProvider,
  FacebookAuthProvider, signInWithPopup,
  getAdditionalUserInfo, AdditionalUserInfo
} from "firebase/auth"; // TODO Remove functions imported and use AngularFireAuth

/**
 * @description Authentication service using Firebase authentication API
 * @summary This service facilitates the sign-in process,
 * watches the user session, and allows us to save custom user data to the Firestore database.
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: "root" // We declare that this service should be created by the root application injector.
})
export class AuthService {
  userAuthState$: Observable<User>;

  /**
   * @description Creates an instance of AuthService and create/set the user of the app (logged in or not/null)
   * @summary The constructor will set the Observable.
   * First it receives the current Firebase auth state.
   * If present, it will hit up Firestore for the user’s saved custom data.
   * If null, it will return an Observable.of(null).
   * @param {AngularFireAuth} angularFireAuth
   * @param {AngularFirestore} angularFirestore
   * @param {Router} router
   * @memberof AuthService
   */
  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore,
    private likeUnlikeService: LikeUnlikeService, private angularFireFunctions: AngularFireFunctions) {
    // The most important element this feature is being able to react to changes to the user’s authentication state
    // Get auth data, then get firestore user document || null
    this.userAuthState$ = this.angularFireAuth.authState.pipe(
      take(Constants.numberValue_One),
      switchMap((user: FireUser): Observable<User> => {
        if (user && !(user.email.includes("@stubud.com"))) { // logged-in (Exists)
          // When logged-in, we want to switchMap to an Observable  of the user’s profile document in Firestore.
          // This is equivalent joining custom data and we can set this up in the constructor
          this.likeUnlikeService.setUserId(user.uid);
          return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc<User>(user.uid).valueChanges();
        } else { // Logged out
          // When logged-out, will have an Observable of null
          return of(null);
        }
      })
    );
  }

  /**
   * @description Register new User in Firebase and add user's details in Firestore DB
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public registerNewUser(userInputs: any): Promise<string | void> {
    return new Promise((resolve: any, reject: any): any => {
      createUserWithEmailAndPassword(getAuth(), userInputs.emailFormC, userInputs.passFormC) // Creates a new user account associated with the specified email address and password
        .then((userCredential: UserCredential): void | PromiseLike<void> => {

          this.createUserDocInDb(userCredential).then((): void => {
            resolve();
          }).catch((error: any): void => {
            console.error("Error writing document in DB: ", error);
            reject("Unable to save your account. Please try again later.");
          });

        }).catch((error: any): void => {
          // console.error("Error creating account: ", error);
          // reject(error);
          switch (error.code) {
            case "auth/email-already-in-use": {
              reject("This account already exists on our side. Login instead.");
              break;
            }

            case "auth/email-already-exists": {
              reject("This account already exists on our side. Login instead.");
              break;
            }

            default: {
              reject("Sorry, we were not able to create an account for you. Please try again later.");
              break;
            }
          }
        });
    });
  }

  /**
   * @description Add newly created user in Firestore DB with his/her profile pic
   * @private
   * @param {auth.UserCredential} userCredential
   * @param {*} userInputs
   * @returns
   * @memberof AuthService
   */
  private createUserDocInDb(userCredential: UserCredential): Promise<void> {
    return this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(userCredential.user.uid).set({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      isAccValid: false,
      accValidity: Constants.numberValue_Twenty
    });
  }

  /**
   * @description Google login. Google auth provider
   * @summary This method triggers the Google Sign in popup  window that authenticates the user with their Google account.
   * It returns a Promise that resolves with the auth credential.
   *
   * @returns
   * @memberof AuthService
   * @see https://firebase.google.com/docs/reference/node/FirebaseAuth.GoogleAuthProvider
   */
  public googleLogin(): Promise<void> {
    // Start a sign in process for an unauthenticated user
    // const provider: auth.GoogleAuthProvider = new auth.GoogleAuthProvider();

    // provider.addScope("PROFILE"); // addScope to request profile pic from Google authentication
    // provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    // return this.oAuthLogin(new auth.GoogleAuthProvider());
    return this.oAuthLogin(new GoogleAuthProvider());
  }

  facebookLogin(): Promise<void> {
    // const provider: auth.FacebookAuthProvider = new auth.FacebookAuthProvider();

    // provider.addScope("public_profile");
    // provider.addScope("user_gender");
    // provider.addScope("user_birthday");
    return this.oAuthLogin(new FacebookAuthProvider());
  }

  /**
   * @description The oAuthLogin() method is useful if you have multiple OAuth options because it can be reused with different providers.
   *
   * @private
   * @param {*} provider
   * @returns
   * @memberof AuthService
   */
  private oAuthLogin(provider: GoogleAuthProvider | FacebookAuthProvider): Promise<void> {
    return new Promise((resolve: any, reject: any): any => {
      signInWithPopup(getAuth(), provider)
        .then((payload: UserCredential): void => {
          if (getAdditionalUserInfo(payload)?.isNewUser) {
            this.createUserDocInDb(payload);
          }
          resolve();
        }).catch((error: any): void => {
          console.error(error);
          reject(error);
        });
    });
  }

  /**
   * @description Sign out the user and navigate to home page
   * @function
   * @member signOut
   * @memberof AuthService
   */
  public signOut(): Promise<void> {
    return new Promise<void>((resolve: any, reject: any): any => {
      if (this.angularFireAuth.currentUser) {
        this.angularFireAuth.signOut()
          .then((): void => {
            this.likeUnlikeService.deactivateService();
            resolve();
          }).catch((error: any): void => {
            reject(error);
          });
      } else {
        reject("No user currently logged in");
      }
    });
  }

  /**
   * @description Sign In user via email
   *
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public signInUser(userInputs: any): Promise<string | void> {
    return new Promise((resolve: any, reject: any): void => {
      this.angularFireAuth.signInWithEmailAndPassword(userInputs.emailFormC, userInputs.passFormC)
        .then((): void => resolve())
        .catch((error: any): void => {

          switch (error.code) {
            case "auth/user-disabled": {
              reject("Sorry your account has been disabled.");
              break;
            }
            case "auth/user-not-found": {
              reject("Sorry this account doesn't exist.");
              break;
            }

            case "auth/wrong-password": {
              reject("Incorrect password entered. Please try again.");
              break;
            }

            default: {
              reject("Sorry, we were not able to log you in. Please try again later.");
              break;
            }
          }

        });
    });
  }

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
      gender: userInputs.genderFormC,
      accValidity: Constants.numberValue_Forty
    });
  }

  // /**
  //  * @description Update user password
  //  *
  //  * @param {string} uid
  //  * @param {*} userInputs
  //  * @returns {Promise<void>}
  //  * @memberof AuthService
  //  */
  // public updateUserPassword(email: string, userInputs: any): Promise<void> {
  //   return FirebaseAuth().currentUser.updatePassword(userInputs.passFormC);
  // }

  /**
   * @description Persist user institution details in DB
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
      accValidity: Constants.numberValue_Sixty
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
        accValidity: Constants.numberValue_Eighty
      }),
      this.angularFireFunctions.httpsCallable(Constants.cloudFunctionSendVerifyInsMail)({ id: uid }).toPromise()
    ]);
  }

  /**
   * @description Send Subscribed email
   *
   * @param {string} email
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public sendSubscribedEmail(email: string): Promise<void> {
    return this.angularFireFunctions.httpsCallable(Constants.cloudFunctionSendSubscribeNewsletterMail)({ email: email }).toPromise();
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
   * @description Add email to subscriptions Db
   *
   * @param {*} userInputs
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public subscribeUser(userInputs: any): Promise<void> {
    return this.angularFirestore.doc(Constants.fbPathRefDiscountsUpdatesDoc).set({
      [userInputs.emailFormC]: true
    });
  }

  /**
   * @description Send Password reset email
   *
   * @param {string} email
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public sendPasswordResetEmail(email: string): Promise<void> {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  /**
   * @description Send Manual Verification notification email
   *
   * @param {string} email
   * @param {string} firstName
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public sendManualVerificationMail(email: string, firstName: string): Promise<void> {
    return this.angularFireFunctions.httpsCallable(Constants.cloudFunctionManualVerificationMail)(
      { email: email, firstName: firstName }).toPromise();
  }

  /**
   * @description Verify oobCode validity
   *
   * @param {string} oobCode
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  public verifyOobCode(oobCode: string): Promise<string> {
    return this.angularFireAuth.verifyPasswordResetCode(oobCode);
  }

  /**
   * @description Reset user password
   *
   * @param {string} oobCode
   * @param {string} newPass
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public resetUserPassword(oobCode: string, newPass: string): Promise<void> {
    return this.angularFireAuth.confirmPasswordReset(oobCode, newPass);
  }

}
