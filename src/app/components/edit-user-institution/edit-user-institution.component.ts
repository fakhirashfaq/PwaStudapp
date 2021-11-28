import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { Institution } from "src/app/models/institution";
import { Region } from "src/app/models/region";
import { User } from "src/app/models/user";
import { EditService } from "src/app/services/edit.service";
import { InstitutionsService } from "src/app/services/institutions.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-edit-user-institution",
  templateUrl: "./edit-user-institution.component.html",
  styleUrls: ["./edit-user-institution.component.css"]
})
export class EditUserInstitutionComponent implements OnInit {

  /**
   * @description ErrorMessage for failed user details set
   *
   * @type {string}
   * @memberof EditUserInstitutionComponent
   */
  public errorMessage: string;

  /**
   * @description Has user clicked on Continue (Submit) button
   *
   * @type {boolean}
   * @memberof EditUserInstitutionComponent
   */
  public isFormSubmitted: boolean;

  /**
   * @description List of available region
   *
   * @type {Observable<Region[]>}
   * @memberof EditUserInstitutionComponent
   */
  public region$: Observable<Region[]>;

  public institutions$: Observable<Institution[]>;

  /**
   * @description FormGroup for edit of user institution
   * @type {FormGroup}
   * @memberof EditUserInstitutionComponent
   */
  public formGroup: FormGroup;

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof EditUserInstitutionComponent
   */
  public currUser: User;

  private readonly YEAR_REGEX: string = "([0-9]{4})";

  constructor(private institutionsService: InstitutionsService,
    private authService: AuthService, private editService: EditService,
    private router: Router, private loadingBar: LoadingBarService) {

  }

  ngOnInit(): void {
    // this.initFormGroup(); // Init Form
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
   * @memberof EditUserInstitutionComponent
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      regionFormC: new FormControl(this.currUser.regId, [Validators.required]),
      // stdMNmFormC: new FormControl(null, [Validators.required]),
      institutionFormC: new FormControl(this.currUser.insId, [Validators.required]),
      gradYrFormC: new FormControl(this.currUser.gradYr, [Validators.required, , Validators.pattern(this.YEAR_REGEX)])
    });
    this.institutions$ = this.institutionsService.retrieveAvailableInstitutions$(this.currUser?.regId);
  }

  /**
   * @description Load available regions from DB
   *
   * @private
   * @memberof EditUserInstitutionComponent
   */
  public loadAvailableRegions$(): Observable<any[]> {
    return this.institutionsService.retrieveAvailableRegions$();
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof EditUserInstitutionComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.formGroup.controls;
  }

  /**
   * @description Change region value and set db ref to institution
   *
   * @param {*} event
   * @member changeRegion
   * @memberof EditUserInstitutionComponent
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
   * @memberof EditUserInstitutionComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        this.initFormGroup();
      });
  }

  /**
   * @description Submit Form
   *
   * @returns {void}
   * @memberof EditUserInstitutionComponent
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
   * @memberof EditUserInstitutionComponent
   */
  private tryUpdateUserDetails(formGroup: FormGroup): void {
    this.loadingBar.start();
    this.editService.updateInstitutionDetails(this.currUser.uid, formGroup.value)
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
