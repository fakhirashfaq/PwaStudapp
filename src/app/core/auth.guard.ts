import { Injectable } from "@angular/core"; // Import Injectable decorator to use it in this class
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Navigation } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, of } from "rxjs";
import { take, map } from "rxjs/operators";
import { User } from "../models/user";
import { Constants } from "../shared/utils/constants";

/**
 * Route Guards allowing navigation to authorized pages
 *
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */

/* Indicate that a component or other class (such as another service, a pipe, or an NgModule) has a dependency.
* At the same time, for good practice, add the Injectable decorator to indicate this class is a service.
*/
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * @description Interface that a class can implement to be a guard deciding if a route can be activated.
   * @summary We just pass it the observable of the user from the auth service.
   * If it emits true, the route can be accessed. If false, the user is redirected.
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   * @memberof AuthGuard
   * @tutorial CanActivate If all guards return true, navigation will continue. If any guard returns false, navigation will be cancelled.
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // gets nav object IF one exists
    const navObject: Navigation = this.router.getCurrentNavigation();

    if (!!navObject && navObject.extras.state && navObject.extras.state.skipGuard) { // bypass the guard based on navigation state
      return of(true);
    }

    return this.authService.userAuthState$.pipe(
      take(Constants.numberValue_One),
      map((user: User): boolean => {
        if (!(!!user)) { // map to boolean. Allow navigation or not depending on the boolean result.
          // Exist ==> false == !false == true. Sign in and not email verified. Allow route navigation
          // Not exist ==> false == !false == true. Not signed in. Allow route navigation.
          return true;
        } else if (user.isAccValid) {
          this.router.navigate([Constants.empty]);
          return false;
        } else {
          switch (user.accValidity) {
            case (Constants.numberValue_Twenty):
              this.router.navigate([Constants.routePage_YourDetails], { state: { skipGuard: true } });
              return true;
            case (Constants.numberValue_Forty):
              this.router.navigate([Constants.routePage_YourInstitution], { state: { skipGuard: true } });
              return true;
            case (Constants.numberValue_Sixty): // fall-through to 80
            case (Constants.numberValue_Eighty):
              this.router.navigate([Constants.routePage_VerifyInstitution], { state: { skipGuard: true } });
              return true;
            // case (Constants.numberValue_Hundred): // Irrelevant since 100 Validity = isAccValid -> true

            default:
              return false;
          }
        }
      })
    );
  }

}
