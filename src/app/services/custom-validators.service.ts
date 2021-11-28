import { Injectable } from "@angular/core";
import { ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Constants } from '../shared/utils/constants';
import { InstitutionsService } from "./institutions.service";

/**
 * @description Service for validation of forms value
 * @export
 * @class CustomValidatorsService
 * @tutorial https://itnext.io/angular-custom-form-validation-bc513b45ccfa
 */
@Injectable({
  providedIn: "root", // We declare that this service should be created by the root application injector. // root level (AppModule) Provided to any class that imports this service
})
export class CustomValidatorsService {

  constructor(private institutionService: InstitutionsService) { }

  /**
   * @description Assert that Password and Confirmation password inserted are the same
   * @param {string} passwordKey
   * @param {string} confirmPasswordKey
   * @returns {ValidatorFn}
   * @member isPasswordsMatching
   * @memberof CustomValidatorsService
   * @summary AbstractControl, is a base class of FormControl, FormArray, and FormGroup,
   * and it allows you to read the value of the control passed to the custom validator function.
   * The custom validator returns either of the following, based on the expression: {[key:string]: boolean} | null
   *  1. If the validation fails, it returns an object, which contains a key-value pair.
   *     Key is the name of the error and the value is always Boolean true.
   *  2. If the validation does not fail, it returns null.
   *  isPasswordsMatching is a factory function returning a function, custom validator, of type ValidatorFn
   */
  isPasswordsMatching(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      if (!control) {
        // Making sure the control (a.k.a the form group) exist
        return null;
      }

      const PASSWORD_CONTROL: AbstractControl = control.get(passwordKey); // Get password AbstractControl from Control
      const CONFIRMED_PASSWORD_CONTROL: AbstractControl = control.get(confirmPasswordKey); // Get Confirmation Password AbstractControl from Control

      if (!PASSWORD_CONTROL.value || !CONFIRMED_PASSWORD_CONTROL.value) {
        // Check that each form control has a value. If the user hasn’t typed in both fields yet, we don’t want to validate.
        return null;
      }

      if (PASSWORD_CONTROL.value !== CONFIRMED_PASSWORD_CONTROL.value) {
        // Then check if the two form control values are equal.
        return { passwordMismatch: true };
      }
      return null; // Returning null from the function is equivalent to saying there is not an error.
    };
  }

  /**
   * @description Construct date values to actual Date object and check validity
   *
   * @param {string} dateKey
   * @param {string} monthKey
   * @param {string} yearKey
   * @returns {ValidatorFn}
   * @memberof CustomValidatorsService
   */
  isDateValid(dateKey: string, monthKey: string, yearKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if (!control) {
        // Making sure the control (a.k.a the form group) exist
        return null;
      }

      const DATE_CONTROL: AbstractControl = control.get(dateKey); // Get date AbstractControl from Control
      const MONTH_CONTROL: AbstractControl = control.get(monthKey); // Get month AbstractControl from Control
      const YEAR_CONTROL: AbstractControl = control.get(yearKey); // Get month AbstractControl from Control

      if (!DATE_CONTROL.value || !MONTH_CONTROL.value || !YEAR_CONTROL.value) {
        // Check that each form control has a value. If the user hasn’t typed in both fields yet, we don’t want to validate.
        return null;
      } else {
        if (Constants.ageLimitRegistration < YEAR_CONTROL.value) {
          return { ageNotAllowed: true };
        }
        if (isNaN( // Check if valid Date
          (new Date(MONTH_CONTROL.value + Constants.slash + DATE_CONTROL.value + Constants.slash + YEAR_CONTROL.value)) // MM/DD/YYYY
            .getTime())) {
          return { dateInvalid: true };
        }
      }

      return null; // Returning null from the function is equivalent to saying there is not an error.
    };
  }

  /**
   * @description Check if user email equals ins email
   *
   * @param {string} emailFormC
   * @param {string} email
   * @param {string} domain
   * @returns {ValidatorFn}
   * @memberof CustomValidatorsService
   */
  isInsEmailDiffEmail(emailFormC: string, email: string, domain: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if (!control) {
        // Making sure the control (a.k.a the form group) exist
        return null;
      }

      const EMAIL_CONTROL: AbstractControl = control.get(emailFormC); // Get date AbstractControl from Control

      if (!EMAIL_CONTROL.value) {
        // Check that each form control has a value. If the user hasn’t typed in both fields yet, we don’t want to validate.
        return null;
      } else {
        if (email === (EMAIL_CONTROL.value + Constants.at + domain)) {
          return { insEmailEqEmail: true };
        }
      }

      return null; // Returning null from the function is equivalent to saying there is not an error.
    };
  }

  isInsEmailUsed(domain: string, uid: string): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

      if (!control) {
        // Making sure the control (a.k.a the form group) exist
        return of(null);
      }

      const EMAIL_VALUE: AbstractControl = control.value; // Get date AbstractControl from Control

      const insEmail: string = EMAIL_VALUE + Constants.at + domain;

      return this.institutionService.isInsEmailUsed(uid, insEmail).pipe(
        map((isInsEmailUsed: boolean): { insEmailUsed: boolean; } | null => isInsEmailUsed ? { insEmailUsed: true } : null)
      );

      // return of(null); // Returning null from the function is equivalent to saying there is not an error.
    };
  }
}
