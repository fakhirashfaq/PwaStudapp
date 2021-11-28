import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { AuthService } from "src/app/core/auth.service";
import { Constants } from "src/app/shared/utils/constants";
import { Helper } from "src/app/shared/utils/helper";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {

  /**
   * @description FormGroup for 1st page of registration
   *
   * @type {FormGroup}
   * @memberof ChangePasswordComponent
   */
   public formGroup: FormGroup;

   /**
    * @description ErrorMessage for failed account creation
    *
    * @type {string}
    * @memberof ChangePasswordComponent
    */
   public errorMessage: string;
 
   /**
    * @description Has form been submitted
    *
    * @type {boolean}
    * @member isFormSubmitted
    * @memberof ChangePasswordComponent
    */
   isFormSubmitted: boolean;

  constructor(private authService: AuthService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof ChangePasswordComponent
   */
   private initFormGroup(): void {
    this.formGroup = new FormGroup({
      emailFormC: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  public submitForm(): void {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    } else {
      this.trySendPasswordResetEmail(this.formGroup);
    }

  }

  /**
   * @description Try login user. Navigate to Home Page on success.
   *
   * @private
   * @param {FormGroup} signInFormG
   * @memberof ChangePasswordComponent
   */
  private trySendPasswordResetEmail(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.authService.sendPasswordResetEmail(formGroup.value.emailFormC)
      .then((): void => {
        this.alertEmailSent(formGroup.value.emailFormC);
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof ChangePasswordComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Alert user that an email was sent
   *
   * @private
   * @memberof ChangePasswordComponent
   */
   private alertEmailSent(insEmail: string): void {
    window.alert("An email was sent to  " + insEmail + " to reset your password. Thank you.");
  }

}
