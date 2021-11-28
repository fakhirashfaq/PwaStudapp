import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { Constants } from "src/app/shared/utils/constants";

/**
 * @description The component just takes a FileList dropped on the div and pushes it to an array
 *
 * @export
 * @class DnDFUploaderComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-dn-d-f-uploader",
  templateUrl: "./dn-d-f-uploader.component.html",
  styleUrls: ["./dn-d-f-uploader.component.css"]
})
export class DnDFUploaderComponent implements OnInit {

  /**
   * @description ForGroup for Files
   *
   * @type {FormGroup}
   * @memberof DnDFUploaderComponent
   */
  public formGroupFiles: FormGroup;

  /**
   * @description Are Files being hovered on Drag and Drop container
   *
   * @type {boolean}
   * @memberof DnDFUploaderComponent
   */
  public isHovering: boolean;

  /**
   * @description Array of files to upload
   *
   * @type {File[]}
   * @memberof DnDFUploaderComponent
   */
  public files: File[] = [];

  /**
   * @description Current User to be sent in the end to Firebase Storage service for uploading files
   *
   * @type {User}
   * @memberof DnDFUploaderComponent
   */
  public currUser: User;

  /**
   * @description Number of completed items
   *
   * @private
   * @type {number}
   * @memberof DnDFUploaderComponent
   */
  private completedItem: number;

  constructor(private authService: AuthService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
    this.completedItem = Constants.numberValue_Zero;
  }

  /**
   * @description Initialize form
   *
   * @private
   * @memberof DnDFUploaderComponent
   */
  private initForm(): void {
    this.formGroupFiles = new FormGroup({
      filesFormC: new FormControl(null, [Validators.required])
    });
  }

  private getCurrentUser(): void {
    this.authService.userAuthState$.subscribe((user: User): void => {
      this.currUser = user;
    });
  }

  /**
   * @description Set isHovering to true if files are hovered on container
   *
   * @param {boolean} event
   * @memberof DnDFUploaderComponent
   */
  public toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  /**
   * @description Push each files selected in array
   *
   * @param {FileList} files
   * @memberof DnDFUploaderComponent
   */
  public onDrop(files: FileList): void {
    this.loadingBar.start();
    for (let index: number = 0; index < files.length; index++) {
      this.files.push(files.item(index));
    }
  }

  /**
   * @description Convenience getter for easy access to form fields
   *
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof DnDFUploaderComponent
   */
  get formContFilesRef(): FormGroup["controls"] {
    return this.formGroupFiles.controls;
  }

  /**
   * @description Delete file from files list
   *
   * @param {number} index (File index)
   * @returns
   * @memberof VerifyInstitutionComponent
   */
  public deleteFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * @description On upload complete, increment number of completed items and send mail if all completes.
   *
   * @memberof DnDFUploaderComponent
   */
  public onComplete(): void {
    this.completedItem++;
    if (this.completedItem === this.files.length) {
      this.authService.sendManualVerificationMail(this.currUser.email, this.currUser.firstName)
      // .finally(() => {

      // });
      this.loadingBar.complete();
      alert("We've received your documents. We will validate your documents as soon as possible.");
      this.router.navigate([Constants.slash]);
    }
  }

}
