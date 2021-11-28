import { Injectable } from "@angular/core";
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from "@angular/fire/compat/storage";
import { Upload } from "../models/upload";
import { finalize, map, take } from "rxjs/operators";
import { Constants } from "../shared/utils/constants";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../core/auth.service";
import { User } from "../models/user";
import { Observable } from "rxjs";

/**
 * @description Service for uploading an image to Firebase Storage
 * @summary This service will upload given Upload object and return the download url of the image in a promise
 * @param {AngularFireStorage}
 * @export
 * @class FbStorageService
 */
@Injectable({
  providedIn: "root" // We declare that this service should be created by the root application injector. // We declare that this service should be created by the root application injector.
})
export class FbStorageService {

  /**
   * @description Root reference to storage bucket
   *
   * @private
   * @type {AngularFireStorageReference}
   * @memberof FbStorageService
   */
  private fileRef: AngularFireStorageReference;

  /**
   * @description The main task
   *
   * @private
   * @type {AngularFireUploadTask}
   * @memberof FbStorageService
   */
  private uploadTask: AngularFireUploadTask;

  constructor(private angularFireStorage: AngularFireStorage, private angularFirestore: AngularFirestore) {
  }

  /**
   * @description Push profile picture on Firebase Storage.
   * @summary Set return Promise with download url or null if an error occurred
   * @param {Upload} upload
   * @returns {Promise<string>}
   * @memberof FbStorageService
   */
  private pushUploadOnFbStorage(upload: Upload): Promise<string> {
    return new Promise<string>((resolve: any): any => {
      if (upload.base64Value) { // Profile pic is not null

        this.fileRef = this.angularFireStorage.ref(`${Constants.fbPathRefProfilePics}/${upload.name}`); // create a reference to the storage bucket location under Profile Pic ref and the file to upload's name
        this.uploadTask = this.fileRef.putString(upload.base64Value, upload.formatType); // the put method creates an AngularFireUploadTask and kicks off the upload

        /* The .snapshotChanges() method on an AngularFireUploadTask returns an object with helpful metadata about the upload.
        Properties such as the totalBytesTransferred, totalBytes in the upload,
        any metadata provided, the state of the upload,
        and the downloadURL of the file once uploaded. */
        this.uploadTask.snapshotChanges().pipe( // get notified when the download URL is available
          finalize((): void => { // finalize method is called when upload completes 100%

            this.fileRef.getDownloadURL().pipe(take(Constants.numberValue_One)).subscribe(
              (downloadURL: string): void => { // Success
                resolve(downloadURL);
              },
              (error: any): void => { // Error
                console.log("Error uploading profile picture of user", error);
                resolve(null);
              },
              (): void => {/* Observable completed */ });
          })
        ).subscribe();
      } else { // Profile pic is null
        resolve(null);
      }



    });

  }

  /**
   * @description Persist Profile pic on DB
   *
   * @param {string} userId
   * @param {string} profilePic
   * @returns {Promise<boolean>}
   * @memberof FbStorageService
   */
  public persistUserProfPic(userId: string, profilePic: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any): void => {
      this.pushUploadOnFbStorage(new Upload(userId, profilePic))
        .then((downloadUrl: string): void => {
          this.angularFirestore.collection(Constants.fbPathRefUsersNode).doc(userId).update({
            profilePic: downloadUrl
          }).then((): void => {
            resolve(true);
          }).catch((error: any): void => {
            console.error(error);
            reject(false);
          });
        }).catch((error: any): void => {
          console.error(error);
          reject(false);
        });
    });

  }

  /**
   * @description Upload user's account verification
   *
   * @param {File} file
   * @returns {Observable<number>}
   * @memberof FbStorageService
   */
  public uploadVerificationFiles(userId: string, file: File): Observable<number> {
    const path: string = `${Constants.fbPathRefUsersNode}/${userId}/${file.name}`;

    // Reference to storage bucket
    const ref: AngularFireStorageReference = this.angularFireStorage.ref(path);

    // The main task
    this.uploadTask = this.angularFireStorage.upload(path, file);

    // Progress monitoring
    return this.uploadTask.percentageChanges();
  }

}
