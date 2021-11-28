import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { Institution } from "src/app/models/institution";
import { User } from "src/app/models/user";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { EditService } from "src/app/services/edit.service";
import { InstitutionsService } from "src/app/services/institutions.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-edit-user-ins-email",
  templateUrl: "./edit-user-ins-email.component.html",
  styleUrls: ["./edit-user-ins-email.component.css"]
})
export class EditUserInsEmailComponent implements OnInit {


  /**
   * @description ErrorMessage for failed files upload
   *
   * @type {string}
   * @memberof EditUserInsEmailComponent
   */
  public errorMessage: string;

  /**
   * @description Has user clicked on Continue (Submit) button
   *
   * @type {boolean}
   * @memberof EditUserInsEmailComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description FormGroup for 4th page of registration
   * @type {FormGroup}
   * @memberof EditUserInsEmailComponent
   */
  public formGroup: FormGroup;

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof EditUserInsEmailComponent
   */
  public currUser: User;

  /**
   * @description Current logged in User's institution
   *
   * @type {Institution}
   * @memberof EditUserInsEmailComponent
   */
  public currIns: Institution;

  constructor(private institutionsService: InstitutionsService,
    private authService: AuthService,
    private loadingBar: LoadingBarService,
    private editService: EditService,
    private router: Router, private customValidatorsService: CustomValidatorsService) {
  }

  ngOnInit(): void {
    //  this.initFormGroup(); // Init Form
    this.getCurrentUser();
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialize FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof EditUserInsEmailComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      emailFormC: new FormControl(
        this.currUser.insEmail.substr(Constants.numberValue_Zero, this.currUser.insEmail.indexOf(Constants.at))
        , [Validators.required, Validators.pattern("^[a-zA-Z0-9.]+$")],
        [this.customValidatorsService.isInsEmailUsed(this.currIns.domains[0], this.currUser.uid)])
    }, {
      validators: [
        this.customValidatorsService.isInsEmailDiffEmail(Constants.emailFormC, this.currUser.email, this.currIns.domains[0])
      ]
    });
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof EditUserInsEmailComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof EditUserInsEmailComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        this.institutionsService.retrieveInstitution$(user.insId).pipe(take(Constants.numberValue_One))
          .subscribe((institution: Institution): void => {
            this.currIns = institution;
            this.initFormGroup(); // Init after to get user email and ins details for email validation
          });
      });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof EditUserInsEmailComponent
   */
  public submitForm(): void {
    this.isFormSubmitted = true;
    if (this.formGroup.invalid) { // stop here if form is invalid
      return;
    } else {
      this.tryUpdateUserDetails(this.constructFinalInsEmail(this.formGroup));
    }
  }

  /**
   * @description Try update user institution details
   *
   * @private
   * @param {string} insEmail
   * @memberof EditUserInsEmailComponent
   */
  private tryUpdateUserDetails(insEmail: string): void {
    this.loadingBar.start();
    this.editService.updateInstitutionEmailAddress(this.currUser.uid, insEmail)
      .then((): void => {
         this.alertEmailSent(insEmail);
         this.router.navigate([Constants.routePage_User]);
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Alert user that an email was sent
   *
   * @private
   * @memberof EditUserInsEmailComponent
   */
  private alertEmailSent(insEmail: string): void {
    window.alert("Verification mail sent to " + insEmail + ". Thank you.");
  }

  /**
   * @description Complete institution email address with uni domain
   *
   * @private
   * @param {FormGroup} formGroup
   * @returns {string}
   * @memberof EditUserInsEmailComponent
   */
  private constructFinalInsEmail(formGroup: FormGroup): string {
    return formGroup.controls[Constants.emailFormC].value.toLowerCase() + Constants.at + this.currIns.domains[0];
  }

}
