import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../core/auth.service";
import { Constants } from "../shared/utils/constants";
import { take, map } from "rxjs/operators";
import { User } from "../models/user";

/**
 * @description Guard to allow routes to valid user only
 *
 * @export
 * @class UserGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: "root"
})
export class UserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.userAuthState$.pipe(
      take(Constants.numberValue_One),
      map((user: User): boolean => {
        if (!(!!user)) { // map to boolean. Allow navigation or not depending on the boolean result.
          // false ==> false == !false == true. Sign in and not email verified. Do not allow route navigation
          // Not exist ==> false == !false == true. Signed in. Do not allow route navigation
          this.router.navigate([Constants.empty]);
          return false;
        } else {
          // Exist ==> true == !true == False. Signed in and email verified. Allow route navigation.
          return true;
        }
      })
    );
  }
}
