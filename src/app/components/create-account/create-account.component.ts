import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { IconDefinition, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/core/auth.service";
import { Constants } from "src/app/shared/utils/constants";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.css"],
})
export class CreateAccountComponent implements OnInit {

  /**
   * @description Is password visible
   *
   * @type {boolean}
   * @memberof CreateAccountComponent
   */
  public isPasswordVisible: boolean;

  public faEye: IconDefinition = faEye;

  public faEyeSlash: IconDefinition = faEyeSlash;

  /**
   * @description FormGroup for 1st page of registration
   *
   * @type {FormGroup}
   * @memberof CreateAccountComponent
   */
  public formGroup: FormGroup;

  /**
   * @description reCaptcha client siteKey
   *
   * @type {string}
   * @memberof CreateAccountComponent
   */
  public siteKey: string;

  /**
   * @description ErrorMessage for failed account creation
   *
   * @type {string}
   * @memberof CreateAccountComponent
   */
  public errorMessage: string;

  /**
   * @description Has form been submitted
   *
   * @type {boolean}
   * @member isFormSubmitted
   * @memberof CreateAccountComponent
   */
  isFormSubmitted: boolean;

  constructor(private customValidatorsService: CustomValidatorsService, private authService: AuthService,
    private router: Router, private loadingBar: LoadingBarService) {
    this.siteKey = environment.reCaptcha.siteKey;
    this.isPasswordVisible = false;
  }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof CreateAccountComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      emailFormC: new FormControl(null, [Validators.required, Validators.email]),
      passFormC: new FormControl(null, [Validators.required, Validators.minLength(Constants.PASSWORD_MIN_SIZE)]),
      passConFormC: new FormControl(null, [Validators.required]),
      recaptcha: new FormControl(Constants.empty, [Validators.required])
    }, {
      validators: [
        this.customValidatorsService.isPasswordsMatching(Constants.passFormC, Constants.passConFormC)
      ]
    });
  }

  /**
   * @description Show/Hide password
   *
   * @memberof CreateAccountComponent
   */
  public showPassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public submitForm(): void {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    } else {
      this.tryRegisterUser(this.formGroup);
    }

  }

  /**
   * @description Try register user. Navigate to UserDetails Page on success.
   *
   * @private
   * @param {FormGroup} signUpFormG
   * @memberof CreateAccountComponent
   */
  private tryRegisterUser(signUpFormG: FormGroup): void {
    this.loadingBar.start();
    this.authService.registerNewUser(signUpFormG.value)
      .then((): void => {
        this.router.navigate([Constants.routePage_YourDetails], { state: { skipGuard: true } });
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof CreateAccountComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

}
