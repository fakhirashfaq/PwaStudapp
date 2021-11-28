import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { IconDefinition, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Constants } from "src/app/shared/utils/constants";
import { AuthService } from "src/app/core/auth.service";
import { Helper } from "src/app/shared/utils/helper";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-page-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})

export class LoginComponent implements OnInit {

  /**
   * @description Is password visible
   *
   * @type {boolean}
   * @memberof LoginComponent
   */
  public isPasswordVisible: boolean;

  public faEye: IconDefinition = faEye;

  public faEyeSlash: IconDefinition = faEyeSlash;

  /**
   * @description FormGroup for 1st page of registration
   *
   * @type {FormGroup}
   * @memberof LoginComponent
   */
  public formGroup: FormGroup;

  /**
   * @description ErrorMessage for failed account creation
   *
   * @type {string}
   * @memberof LoginComponent
   */
  public errorMessage: string;

  /**
   * @description Has form been submitted
   *
   * @type {boolean}
   * @member isFormSubmitted
   * @memberof LoginComponent
   */
  isFormSubmitted: boolean;

  constructor(private authService: AuthService, private loadingBar: LoadingBarService) {
  }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    this.isFormSubmitted = false;
  }

  // goToPage(pageURL: string): void {
  //   this.router.navigate([pageURL]);
  // }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof LoginComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      emailFormC: new FormControl(null, [Validators.required, Validators.email]),
      passFormC: new FormControl(null, [Validators.required])
    });
  }

  /**
   * @description Show/Hide password
   *
   * @memberof LoginComponent
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
      this.tryLoginUser(this.formGroup);
    }

  }

  /**
   * @description Try login user. Navigate to Home Page on success.
   *
   * @private
   * @param {FormGroup} signInFormG
   * @memberof LoginComponent
   */
  private tryLoginUser(signInFormG: FormGroup): void {
    this.loadingBar.start();
    this.authService.signInUser(signInFormG.value)
      .then((): void => {
        Helper.reloadPage();
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
   * @memberof LoginComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }
}
