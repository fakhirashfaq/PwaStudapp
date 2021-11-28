import { Injectable } from "@angular/core"; // Import Injectable decorator to use it in this class
import { Discount } from "../models/index";
import { AngularFirestore, DocumentData, Query, CollectionReference } from "@angular/fire/compat/firestore";
import { Observable, forkJoin, from, of } from "rxjs";
import { Constants } from "../shared/utils/constants";
import { map, switchMap, take } from "rxjs/operators";
import { Filter } from "../models/filter";
import { SearchService } from "./search.service";
import { FilterService } from "./filter.service";
import { Helper } from "../shared/utils/helper";
import { CarouselItem } from "../models/carouselItem";

/* @Injectable - Indicate that a component or other class (such as another service, a pipe, or an NgModule) has a dependency.
At the same time, for good practice, add the Injectable decorator to indicate this class is a service.
 */
/**
 * @description Fetch discounts from firestore db
 * @export
 * @class DiscountService
 */
@Injectable({
  providedIn: "root", // We declare that this service should be created by the root application injector. // root level (AppModule) Provided to any class that imports this service
})
export class DiscountService {

  /**
   * @description Instantiate DiscountService service to be used by any components that subscribe.
   * @summary Will instantiate default filter object and set it as initial filter stream
   * @param {AngularFirestore} angularFirestore
   * @memberof DiscountService
   */
  constructor(private angularFirestore: AngularFirestore,
    private searchService: SearchService) {
  }

  /**
   * @description Generate Query based on filter and fetch discounts from Db
   * @param {Filter} filter Filtering values
   * @private
   * @returns {Observable<DocumentChangeAction<unknown>[]>}
   * @member getDiscountsCollFromDB$
   * @memberof DiscountService
   */
  private getDiscountsCollFromDB$(filter: Filter): any {
    console.log("Filter: ", filter);
    if (Helper.isAlgoliaSearch(filter.searchInput)) { // Filtering via Algolia
      return from(this.searchService.searchDiscounts(filter)).pipe(
        switchMap((searchResponse: any): Observable<any> => {
          if (searchResponse.hits.length !== Constants.numberValue_Zero) {
            // Set Algolia offset to current (already downloaded hits) + newly downloaded hits
            FilterService.filter.algoliaOffset = FilterService.filter.algoliaOffset + searchResponse.hits.length;
            return forkJoin(searchResponse.hits.map((hit: any): Observable<any> => { // Map all results to FB get calls for each ID
              return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode).doc(hit.objectID).valueChanges().pipe(
                take(Constants.numberValue_One)
              );
            }));
          } else {
            return of([]); // No result found. Returning empty array observable instead of EMPTY to receive empty list in homeComponent and set isDiscountLoaded to false.
          }
        })
      );
    } else { // Filtering via Firebase only
      return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode,
        (queryFn: CollectionReference | Query):
        CollectionReference<DocumentData>
        | Query<DocumentData> => {

          queryFn = queryFn.where(Constants.isArch, Constants.equals, false);

          if (filter.ctg !== Constants.defFilterCtg) { // Category Filter
            queryFn = queryFn.where(Constants.algoliaAtrSubCtg, Constants.equals, filter.ctg);
          }

          if (filter.discountLocationTypeFilter !== Constants.stringValue_Zero) { // Location Filter - Offline & Online
            // const IS_ONLINE_FN_QUERY: boolean = filter.discountLocationTypeFilter === Constants.stringValue_Two;
            queryFn = queryFn.where(Constants.algoliaAtrType, Constants.equals, filter.discountLocationTypeFilter);
          }

          if (filter.sort === Constants.stringValue_Two) { // Extra sorting - Cool
            queryFn = queryFn.where(Constants.algoliaAtrIsSpons, Constants.equals, true);
          }

          if (filter.nearby === Constants.stringValue_One) {
            // queryFn = queryFn.where("posXY  ")
          }

          if (filter.sort === Constants.stringValue_One) { // Sorting Filtering
            queryFn = queryFn.orderBy(Constants.algoliaAtrDateCreated, "desc")
                              .startAfter(filter.discountOffset ? filter.discountOffset : new Date());
          } else {
            queryFn = queryFn.orderBy(Constants.id)
                              .startAfter(filter.discountOffset ? filter.discountOffset : Constants.empty);
          }
          return queryFn.limit(Constants.numberValue_six); // TODO To be fixed, wrong calculation. Downloading about 12 and more after multiple clicking on load more
        }
      ).valueChanges();
    }

  }

  /**
   * @description Map all discounts data fetched from DB to Discounts Array
   * @function
   * @returns {Observable<Discount[]>}
   * @member getAllDiscountObj$
   * @memberof DiscountService
   */
  public getAllDiscountObj$(filter: Filter): Observable<Discount[]> {
    return this.getDiscountsCollFromDB$(filter).pipe(
      take(Constants.numberValue_One) // Take 1 to prevent Firebase from updating discounts on discount like/unlike
      , map((actions: Discount[]): Discount[] => { // Note: Only 1 array is returned
        return actions.map((action: Discount): Discount => {
          return action as Discount;
        });
      })
    );
  }

  /**
   * @description Retrieve Discount Document from DB. Take 1 and completes
   * @param {string} discountId
   * @returns {Observable<Discount>}
   * @member getDiscountCollFromDbViaID$
   * @memberof DiscountService
   */

  public getDiscountCollFromDbViaID$(discountId: string): Observable<Discount> {
    return this.angularFirestore.collection(Constants.fbPathRefDiscountsNode).doc<Discount>(discountId).valueChanges()
    .pipe(take(Constants.numberValue_One));
  }

  /**
   * @description Get Carousel Items
   *
   * @returns {Observable<CarouselItem[]>}
   * @memberof DiscountService
   */
  public getCarouselItems(): Observable<CarouselItem[]> {
    return this.angularFirestore.collection<CarouselItem>(Constants.fbPathRefUsedCarouselNode, (queryFn: CollectionReference | Query):
    CollectionReference<DocumentData>
    | Query<DocumentData> => {
      return queryFn.where(Constants.isArch, Constants.equals, false);
    }).valueChanges()
    .pipe(take(Constants.numberValue_One));
  }

}
