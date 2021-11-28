import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { AuthService } from "src/app/core/auth.service";
import { take } from "rxjs/operators";
import { Constants } from "src/app/shared/utils/constants";
import { User } from "src/app/models/user";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {

  /**
   * @description FormGroup for 2nd page of registration
   *
   * @type {FormGroup}
   * @memberof UserDetailsComponent
   */
  public formGroup: FormGroup;

  /**
   * @description ErrorMessage for failed user details set
   *
   * @type {string}
   * @memberof UserDetailsComponent
   */
  public errorMessage: string;

  /**
   * @description Has form been submitted
   *
   * @type {boolean}
   * @member isFormSubmitted
   * @memberof UserDetailsComponent
   */
  isFormSubmitted: boolean;

  /**
   * @description Regular expression for first name and last name
   * @readonly
   * @type {string}
   * @member NAME_REGEX
   * @memberof UserDetailsComponent
   */
  readonly NAME_REGEX: string = "^[a-zA-Z\\s]*$";

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof UserDetailsComponent
   */
  public currUser: User;

  constructor(private customValidatorsService: CustomValidatorsService,
    private authService: AuthService,
    private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    this.getCurrentUser();
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof UserDetailsComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      fNameFormC: new FormControl(null, [Validators.required, Validators.pattern(this.NAME_REGEX)]),
      lNameFormC: new FormControl(null, [Validators.required, Validators.pattern(this.NAME_REGEX)]),
      genderFormC: new FormControl(null, [Validators.required]),
      dobDayFormC: new FormControl(null, [Validators.required]),
      dobMonthFormC: new FormControl(null, [Validators.required]),
      dobYearFormC: new FormControl(null, [Validators.required]),
    }, {
      validators: [this.customValidatorsService.isDateValid(Constants.dobDayFormC, Constants.dobMonthFormC, Constants.dobYearFormC)]
    });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof UserDetailsComponent
   */
  public submitForm(): void {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    } else {
      this.tryUpdateUserDetails(this.formGroup);
    }

  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof UserDetailsComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
      });
  }

  /**
   * @description Log out and navigate to Home Page
   * @member logout
   * @memberof UserDetailsComponent
   */
  public logout(): void {
    this.loadingBar.start();
    this.authService.signOut()
      .then((): void => {
        this.router.navigate([Constants.slash]);
      }).catch((error: any): void => {
        console.error("Error logging out, ", error);
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof UserDetailsComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Set month value to FormGroup
   *
   * @param {*} event
   * @member changeMonth
   * @memberof UserDetailsComponent
   */
  public changeMonth(event: any): void {
    this.formContRef.dobMonthFormC.setValue(event.target.value);
  }

  /**
   * @description Try update user details
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof UserDetailsComponent
   */
  private tryUpdateUserDetails(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.authService.updateUserDetails(this.currUser.uid, formGroup.value)
      .then((): void => {
        this.router.navigate([Constants.routePage_YourInstitution], { state: { skipGuard: true } });
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

}
