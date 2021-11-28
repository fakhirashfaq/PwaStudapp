import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user";
import { InstitutionsService } from "src/app/services/institutions.service";
import { AuthService } from "src/app/core/auth.service";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { Constants } from "src/app/shared/utils/constants";
import { Institution } from "src/app/models/institution";
import { IconDefinition, faFile, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";

@Component({
  selector: "app-verify-institution",
  templateUrl: "./verify-institution.component.html",
  styleUrls: ["./verify-institution.component.css"]
})
export class VerifyInstitutionComponent implements OnInit {


  /**
   * @description Boolean switch between manual verification and email verification
   *
   * @type {boolean}
   * @memberof VerifyInstitutionComponent
   */
  public isManualVerification: boolean;

  /**
   * @description ErrorMessage for failed files upload
   *
   * @type {string}
   * @memberof VerifyInstitutionComponent
   */
  public errorMessage: string;

  /**
   * @description Has user clicked on Continue (Submit) button
   *
   * @type {boolean}
   * @memberof VerifyInstitutionComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description FormGroup for 4th page of registration
   * @type {FormGroup}
   * @memberof VerifyInstitutionComponent
   */
  public formGroup: FormGroup;

  /**
   * @description FormGroup for File upload
   *
   * @type {FormGroup}
   * @memberof VerifyInstitutionComponent
   */
  public formGroupFiles: FormGroup;

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof VerifyInstitutionComponent
   */
  public currUser: User;

  /**
   * @description Current logged in User's institution
   *
   * @type {Institution}
   * @memberof VerifyInstitutionComponent
   */
  public currIns: Institution;

  faFile: IconDefinition = faFile;

  faTrashAlt: IconDefinition = faTrashAlt;

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  files: any[] = [];

  constructor(private institutionsService: InstitutionsService,
    private authService: AuthService,
    private router: Router,
    private loadingBar: LoadingBarService, private customValidatorsService: CustomValidatorsService) {
    this.isManualVerification = false;
  }

  ngOnInit(): void {
    // this.initFormGroup(); // Init Form
    this.getCurrentUser();
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialize FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof VerifyInstitutionComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      emailFormC: new FormControl(
        null,
        [Validators.required, Validators.pattern("^[a-zA-Z0-9.]+$")],
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
   * @memberof VerifyInstitutionComponent
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
   * @memberof VerifyInstitutionComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        this.institutionsService.retrieveInstitution$(user?.insId).pipe(take(Constants.numberValue_One))
          .subscribe((institution: Institution): void => {
            this.currIns = institution;
            this.initFormGroup(); // Init after to get user email and ins details for email validation
            this.fillEmail();
          });
      });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof VerifyInstitutionComponent
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
   * @description Fill user institution email if exists
   *
   * @private
   * @memberof VerifyInstitutionComponent
   */
  private fillEmail(): void {
    if (!!this.currUser.insEmail) {
      this.formGroup.setValue({
        emailFormC: this.currUser.insEmail.substr(Constants.numberValue_Zero, this.currUser.insEmail.indexOf(Constants.at))
      });
    }
  }

  /**
   * @description Try update user institution details
   *
   * @private
   * @param {string} insEmail
   * @memberof VerifyInstitutionComponent
   */
  private tryUpdateUserDetails(insEmail: string): void {
    this.loadingBar.start();
    this.authService.updateInstitutionEmailAddress(this.currUser.uid, insEmail)
      .then((): void => {
        this.alertEmailSent(insEmail);
        this.router.navigate([Constants.slash]);
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
   * @memberof VerifyInstitutionComponent
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
   * @memberof VerifyInstitutionComponent
   */
  private constructFinalInsEmail(formGroup: FormGroup): string {
    return formGroup.controls[Constants.emailFormC].value.toLowerCase() + Constants.at + this.currIns.domains[0];
  }

  /**
   * @description Log out and navigate to Home Page
   * @member logout
   * @memberof VerifyInstitutionComponent
   */
  public logout(): void {
    this.loadingBar.start();
    this.authService.signOut()
      .then((): void => {
        this.router.navigate([Constants.slash]);
      }, (error: any): void => {
        console.error("Logout error", error);
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Swap verification method
   *
   * @memberof VerifyInstitutionComponent
   */
  public swapVerification(): void {
    this.isManualVerification = !this.isManualVerification;
  }

}
