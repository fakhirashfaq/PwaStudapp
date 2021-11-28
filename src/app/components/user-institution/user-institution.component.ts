import { Component, OnInit } from "@angular/core";
import { InstitutionsService } from "src/app/services/institutions.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Region } from "src/app/models/region";
import { AuthService } from "src/app/core/auth.service";
import { take } from "rxjs/operators";
import { Constants } from "src/app/shared/utils/constants";
import { User } from "src/app/models/user";
import { Institution } from "src/app/models/institution";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-user-institution",
  templateUrl: "./user-institution.component.html",
  styleUrls: ["./user-institution.component.css"]
})
export class UserInstitutionComponent implements OnInit {

  /**
   * @description ErrorMessage for failed user details set
   *
   * @type {string}
   * @memberof UserInstitutionComponent
   */
  public errorMessage: string;

  /**
   * @description Has user clicked on Continue (Submit) button
   *
   * @type {boolean}
   * @memberof UserInstitutionComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description List of available region
   *
   * @type {Observable<Region[]>}
   * @memberof UserInstitutionComponent
   */
  public region$: Observable<Region[]>;

  public institutions$: Observable<Institution[]>;

  /**
   * @description FormGroup for 3rd page of registration
   * @type {FormGroup}
   * @memberof UserInstitutionComponent
   */
  public formGroup: FormGroup;

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof UserInstitutionComponent
   */
  public currUser: User;

  private readonly YEAR_REGEX: string = "([0-9]{4})";

  constructor(private institutionsService: InstitutionsService,
    private authService: AuthService,
    private router: Router, private loadingBar: LoadingBarService) {

  }

  ngOnInit(): void {
    this.initFormGroup(); // Init Form
    // this.loadAvailableRegions$();
    this.region$ = this.institutionsService.retrieveAvailableRegions$();
    this.getCurrentUser();
    this.isFormSubmitted = false;
  }

  /**
   * @description Initialize FormGroup & FormControl
   *
   * @private
   * @member initFormGroup
   * @memberof UserInstitutionComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      regionFormC: new FormControl(null, [Validators.required]),
      // stdMNmFormC: new FormControl(null, [Validators.required]),
      institutionFormC: new FormControl(null, [Validators.required]),
      gradYrFormC: new FormControl(null, [Validators.required, , Validators.pattern(this.YEAR_REGEX)])
    });
  }

  /**
   * @description Load available regions from DB
   *
   * @private
   * @memberof UserInstitutionComponent
   */
  public loadAvailableRegions$(): Observable<any[]> {
    return this.institutionsService.retrieveAvailableRegions$();
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof UserInstitutionComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Change region value and set db ref to institution
   *
   * @param {*} event
   * @member changeRegion
   * @memberof UserInstitutionComponent
   */
  public changeRegion(event: any): void {
    this.institutions$ = this.institutionsService.retrieveAvailableInstitutions$(event.target.value);
  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof UserInstitutionComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
      });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof UserInstitutionComponent
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
   * @description Try update user institution details
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof UserInstitutionComponent
   */
  private tryUpdateUserDetails(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.authService.updateInstitutionDetails(this.currUser.uid, formGroup.value)
      .then((): void => {
        this.router.navigate([Constants.routePage_VerifyInstitution], { state: { skipGuard: true } });
      }).catch((error: any): void => {
        console.error(error);
        this.errorMessage = error.message;
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Log out and navigate to Home Page
   * @member logout
   * @memberof UserInstitutionComponent
   */
  public logout(): void {
    this.loadingBar.start();
    this.authService.signOut()
      .then((): void => {
        this.router.navigate([Constants.slash]);
      }).catch((error: any): void => {
        console.error("Logout error", error);
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }
}
