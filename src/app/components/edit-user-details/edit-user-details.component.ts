import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { EditService } from "src/app/services/edit.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-edit-user-details",
  templateUrl: "./edit-user-details.component.html",
  styleUrls: ["./edit-user-details.component.css"]
})
export class EditUserDetailsComponent implements OnInit {

  /**
   * @description FormGroup for edit of User details
   *
   * @type {FormGroup}
   * @memberof EditUserDetailsComponent
   */
  public formGroup: FormGroup;

  /**
   * @description ErrorMessage for failed user details set
   *
   * @type {string}
   * @memberof EditUserDetailsComponent
   */
  public errorMessage: string;

  /**
   * @description Has form been submitted
   *
   * @type {boolean}
   * @member isFormSubmitted
   * @memberof EditUserDetailsComponent
   */
  isFormSubmitted: boolean;

  /**
   * @description Regular expression for first name and last name
   * @readonly
   * @type {string}
   * @member NAME_REGEX
   * @memberof EditUserDetailsComponent
   */
  readonly NAME_REGEX: string = "^[a-zA-Z\\s]*$";

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof EditUserDetailsComponent
   */
  public currUser: User;

  constructor(private customValidatorsService: CustomValidatorsService,
    private authService: AuthService,
    private router: Router, private loadingBar: LoadingBarService, private editService: EditService) { }

  ngOnInit(): void {
    // this.initFormGroup(); // Init Form
    this.getCurrentUser();
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialized FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof EditUserDetailsComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      fNameFormC: new FormControl(this.currUser.firstName, [Validators.required, Validators.pattern(this.NAME_REGEX)]),
      lNameFormC: new FormControl(this.currUser.lastName, [Validators.required, Validators.pattern(this.NAME_REGEX)]),
      genderFormC: new FormControl(this.currUser.gender, [Validators.required]),
      dobDayFormC: new FormControl(this.currUser.dOB.toDate().getDate(), [Validators.required]),
      dobMonthFormC: new FormControl(this.currUser.dOB.toDate().getMonth() + Constants.numberValue_One, [Validators.required]),
      dobYearFormC: new FormControl(this.currUser.dOB.toDate().getFullYear(), [Validators.required]),
    }, {
      validators: [this.customValidatorsService.isDateValid(Constants.dobDayFormC, Constants.dobMonthFormC, Constants.dobYearFormC)]
    });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof EditUserDetailsComponent
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
   * @memberof EditUserDetailsComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        this.initFormGroup();
      });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof EditUserDetailsComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Set month value to FormGroup
   *
   * @param {*} event
   * @member changeMonth
   * @memberof EditUserDetailsComponent
   */
  public changeMonth(event: any): void {
    this.formContRef.dobMonthFormC.setValue(event.target.value);
  }

  /**
   * @description Try update user details
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof EditUserDetailsComponent
   */
  private tryUpdateUserDetails(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.editService.updateUserDetails(this.currUser.uid, formGroup.value)
      .then((): void => {
        this.router.navigate([Constants.routePage_User]);
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

}
