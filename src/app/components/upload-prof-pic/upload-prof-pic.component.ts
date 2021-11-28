import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IconDefinition, faCamera, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/user';
import { EditService } from 'src/app/services/edit.service';
import { FbStorageService } from 'src/app/services/fb-storage.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-upload-prof-pic',
  templateUrl: './upload-prof-pic.component.html',
  styleUrls: ['./upload-prof-pic.component.css']
})
export class UploadProfPicComponent implements OnInit {

  /**
   * @description fas fa-camera icon of Font Awesome
   * @type {IconDefinition}
   * @member faCamera
   * @memberof UploadProfPicComponent
   */
  faCamera: IconDefinition = faCamera;

  /**
   * @description Profile picture FormGroup
   * @member profPicFormG
   * @type {FormGroup}
   * @memberof UploadProfPicComponent
   */
  profPicFormG: FormGroup;

  /**
   * @description Profile pic Url
   * @member profPicUrl
   * @type {string}
   * @memberof UploadProfPicComponent
   */
  profPicUrl: string;

  /**
   * @description Is cropper active for display
   * @type {boolean}
   * @memberof UploadProfPicComponent
   */
  isCropperVisible: boolean;

  croppedImage: any;

  imageChangedEvent: any = "";

  public currUser: User;

  public profPic: string;

  public isUploadInProgress: boolean;

  constructor(private authService: AuthService, private fbStorageService: FbStorageService,
    private loadingBar: LoadingBarService, private router: Router, private editService: EditService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.isUploadInProgress = false;
  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof DiscountComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        this.profPic = this.currUser.profilePic ? this.currUser.profilePic : Constants.defaultProfilePic;
      });
  }

  /**
   * @description Triggered on change for input profile picture
   * @summary When you choose a file from the file input, it will trigger fileChangeEvent.
   * That event is then passed to the image cropper through imageChangedEvent which will load the image into the cropper.
   * @param {*} event
   * @memberof UploadProfPicComponent
   */
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isCropperVisible = true; // Make cropper visible
  }

  /**
   * @description Emits when the image was loaded into the cropper
   *
   * @memberof UploadProfPicComponent
   */
  imageLoaded(): void {
  }

  /**
   * @description Get current cropped image from ImageCroppedEvent event as a base64 string
   * @summary Every time you release the mouse,
   * the imageCropped event will be triggered with the cropped image as a Base64 string in its payload.
   * @param {ImageCroppedEvent} event
   * @memberof UploadProfPicComponent
   */
  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.profPic = this.croppedImage;
  }

  /**
   * @description Emits when the cropper is ready to be interacted
   *
   * @memberof UploadProfPicComponent
   */
  cropperReady(): void {
  }

  loadImageFailed(): void {
  }

  /**
   * @description Patch the profile picture as base64 to the Profile pic FormControl and set the cropper visibility to false.
   * @function
   * @member uploadProfPic
   * @memberof UploadProfPicComponent
   */
  uploadProfPic(): void {
    this.isCropperVisible = false; // Set the cropper visibility to false after upload button is clicked
    this.loadingBar.start(); // Start loading bar
    this.isUploadInProgress = true;
    this.fbStorageService.persistUserProfPic(this.currUser.uid, this.croppedImage)
      .then((): void => {
        this.loadingBar.complete();
        this.isUploadInProgress = false;
        this.router.navigate([Constants.routePage_User]);
      }).catch((error: any): void => {
        this.isUploadInProgress = false;
        // Show popup message
        console.error(error)
      });
  }

  /**
   * @description Cancel profile pic upload
   *
   * @memberof UploadProfPicComponent
   */
  public cancelProfPic(): void {
    this.isCropperVisible = false; // Set the cropper visibility to false after upload button is clicked
    this.profPic = this.currUser.profilePic ? this.currUser.profilePic : Constants.defaultProfilePic;
  }

  /**
   * @description Remove user Profile pic
   *
   * @memberof UploadProfPicComponent
   */
  public removeUserProfPic(): void {
    this.loadingBar.start(); // Start loading bar
    this.editService.deleteProfPic(this.currUser.uid).then((): void => {
      this.loadingBar.complete();
      this.router.navigate([Constants.routePage_User]);
    }).catch((error: any): void => {
      console.error(error);
      this.loadingBar.complete();
    })
  }

}
