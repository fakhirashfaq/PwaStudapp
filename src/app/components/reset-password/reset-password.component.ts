import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { AuthService } from "src/app/core/auth.service";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { Constants } from "src/app/shared/utils/constants";
import { IconDefinition, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {

  /**
   * @description FormGroup for 1st page of registration
   *
   * @type {FormGroup}
   * @memberof ResetPasswordComponent
   */
  public formGroup: FormGroup;

  /**
   * @description ErrorMessage for failed account creation
   *
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  public errorMessage: string;

  /**
   * @description Has form been submitted
   *
   * @type {boolean}
   * @member isFormSubmitted
   * @memberof ResetPasswordComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description Is password visible?
   *
   * @type {boolean}
   * @memberof ResetPasswordComponent
   */
  public isPasswordVisible: boolean;

  public faEye: IconDefinition = faEye;

  public faEyeSlash: IconDefinition = faEyeSlash;

  /**
   * @description Can user reset password?
   *
   * @type {boolean}
   * @memberof ResetPasswordComponent
   */
  public canResetPassword: boolean;

  /**
   * @description A code Firebase uses to prove that this is a real password reset.
   *
   * @private
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  private actionCode: string;

  constructor(private authService: AuthService, private loadingBar: LoadingBarService,
    private customValidatorsService: CustomValidatorsService, private activatedRoute: ActivatedRoute,
    private router: Router) {
    }

  ngOnInit(): void {
    this.canResetPassword = false;
    this.retrieveOobCode();
    this.isFormSubmitted = false;
    this.isPasswordVisible = false;
  }

  /**
   * @description Retrieve oobCode from params and verify authenticity
   *
   * @private
   * @memberof ResetPasswordComponent
   */
  private retrieveOobCode(): void {
    this.activatedRoute.queryParams
    .pipe(take(Constants.numberValue_One))
    .subscribe((params: Params): void => {
      // if we didn't receive any parameters => Invalid access
      if (!(!!params)) {
        this.router.navigate([Constants.empty]);
      }

      this.actionCode = params.oobCode;

      this.authService.verifyOobCode(params.oobCode).then((): void => {
        this.canResetPassword = true;
        this.initFormGroup();
      }).catch((error: any): void => {
        // Invalid or expired action code. Ask user to try to reset the password again
        alert(error);
        console.error(error);
        this.router.navigate([Constants.routePage_ChangePass]);
      });
    });
  }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof ResetPasswordComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      passFormC: new FormControl(null, [Validators.required, Validators.minLength(Constants.PASSWORD_MIN_SIZE)]),
      passConFormC: new FormControl(null, [Validators.required]),
    }, {
      validators: [
        this.customValidatorsService.isPasswordsMatching(Constants.passFormC, Constants.passConFormC)
      ]
    });
  }

  public submitForm(): void {
    this.isFormSubmitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    } else {
      this.tryResetUserPassword(this.formGroup);
    }

  }

  /**
   * @description Try reset user's password.
   *
   * @private
   * @param {FormGroup} signInFormG
   * @memberof ResetPasswordComponent
   */
  private tryResetUserPassword(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.authService.resetUserPassword(this.actionCode, formGroup.value.passFormC)
      .then((): void => {
        // this.alertEmailSent(formGroup.value.emailFormC);
        alert("Your password have been reset");
        this.router.navigate([Constants.empty]);
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
   * @memberof ResetPasswordComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Show/Hide password
   *
   * @memberof ResetPasswordComponent
   */
  public showPassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
