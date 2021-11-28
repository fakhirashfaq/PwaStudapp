import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-manual-verifications",
  templateUrl: "./manual-verifications.component.html",
  styleUrls: ["./manual-verifications.component.css"]
})
export class ManualVerificationsComponent implements OnInit {

  /**
   * @description Current user
   *
   * @type {User}
   * @memberof ManualVerificationsComponent
   */
  public currUser: User;

  /**
   * @description ErrorMessage for invalid inputs
   *
   * @type {string}
   * @memberof ManualVerificationsComponent
   */
  public errorMessage: string;

  /**
   * @description Has user clicked on Continue (Submit) button
   *
   * @type {boolean}
   * @memberof ManualVerificationsComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description FormGroup for 4th page of registration
   * @type {FormGroup}
   * @memberof ManualVerificationsComponent
   */
  public formGroup: FormGroup;

  /**
   * @description True if upload of matric number succeeded.
   *
   * @type {boolean}
   * @memberof ManualVerificationsComponent
   */
  public success: boolean;


  constructor(private authService: AuthService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    this.success = false;
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.authService.userAuthState$.subscribe((user: User): void => {
        this.currUser = user;
    });
  }

  /**
   * @description Initialize FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof ManualVerificationsComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      stdMNmFormC: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof ManualVerificationsComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof ManualVerificationsComponent
   */
  public submitForm(): void {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    } else {
      // this.isManualVerification ? this.tryUploadUserVerificationFiles() : this.tryUpdateUserDetails(this.formGroup);
      this.tryUpdateUserDetails(this.formGroup);
    }
  }

  /**
   * @description Try update user institution details
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof ManualVerificationsComponent
   */
  private tryUpdateUserDetails(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.authService.updateMatNm(this.currUser.uid, formGroup.value)
      .then((): void => {
        this.success = true;
        setTimeout((): void => {
          this.router.navigate([Constants.slash]);
        }, 5000); // Wait 5 seconds

      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

}
