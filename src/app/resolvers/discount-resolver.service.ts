import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Discount } from "../models/discount";
import { Constants } from "../shared/utils/constants";
import { DiscountService, BuddyService } from "../services";
import { tap, concatMap } from "rxjs/operators";
import { Buddy } from "../models/buddy";
import { Observable, Subscriber } from "rxjs";

/**
 * @description Resolve Discount and Buddy info/data before loading DiscountComponent.
 *
 * @export
 * @class DiscountResolverService
 * @summary
 * ActivatedRouteSnapshot
 *  - Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
 */
@Injectable({
  providedIn: "root",
})
export class DiscountResolverService implements Resolve<any> {

  constructor(
    private discountService: DiscountService,
    private buddyService: BuddyService,
    private router: Router
  ) {}

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<any> {
    return this.getDiscountAndBuddy(activatedRouteSnapshot.paramMap.get(Constants.id)
    );
  }

  /**
   * @description Get discount and buddy data
   * @function
   * @private
   * @param {string} discountId
   * @returns {Observable<any>}
   * @member getDiscountAndBuddy
   * @memberof DiscountResolverService
   */
  private getDiscountAndBuddy(discountId: string): Observable<any> {
    let resolvedDiscountAndBuddy: any;
    return new Observable((observer: Subscriber<any>): void => {
      this.discountService.getDiscountCollFromDbViaID$(discountId)
        .pipe(
          tap((discount: Discount): void => {
            discount.id = discountId;
            resolvedDiscountAndBuddy = {
              discount
            };
            observer.next(discount);
          }),
          concatMap((discount: Discount): Observable<Buddy> =>
            // Collect observables and subscribe to next when previous completes.
            this.buddyService.getBuddyCollFromDB$(discount.bdRef)
          )
        )
        .subscribe(
          (buddy: Buddy): void => {
            resolvedDiscountAndBuddy = {
              ...resolvedDiscountAndBuddy,
              buddy,
            };
            observer.next(resolvedDiscountAndBuddy);
          },
          (): void => { // Error object is the id which doesn't exist
            console.log("Unable to retrieve Discount Data");
            this.router.navigate([Constants.routePage_404]);
          },
          (): void => {
            observer.complete();
          }
        );
    });
  }

}
