import { Component, OnInit, OnDestroy } from "@angular/core";
import { DistanceService } from "../../services/distance.service";
import { Constants } from "../../shared/utils/constants";
import { Observable, Subject } from "rxjs";
import { take, switchMap, takeUntil, tap } from "rxjs/operators";
import { DiscountService } from "../../services";
import { Discount } from "../../models";
import { Filter } from "../../models/filter";
import { Router } from "@angular/router";
import { Helper } from "src/app/shared/utils/helper";
import { FilterService } from "src/app/services/filter.service";
import { CarouselItem } from "src/app/models/carouselItem";

/**
 * @description Component for Home Page
 * @export
 * @class HomeComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: "app-home", // This selector is not required since this component is router to and is also not used as a child component.
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  curMenuItem: string = Constants.homePageTitle;

  isLocationFilter: boolean = false;
  isEnableLocation: boolean = false;
  curPosition: any = null;

  /**
   * @description Array of Discounts
   *
   * @type {Discount[]}
   * @memberof HomeComponent
   */
  public discountsArr: Discount[];

  /**
   * @description Current selected category
   *
   * @type {string}
   * @memberof HomeComponent
   */
  public currCategory: string;

  /**
   * @description Boolean for whether or not discount has loaded yet from DB
   *
   * @type {boolean}
   * @memberof HomeComponent
   */
  public isDiscountLoaded: boolean;

  /**
   * @description Carousel Items
   *
   * @type {CarouselItem[]}
   * @memberof HomeComponent
   */
  public carouselItems: CarouselItem[];

  /**
   * @description The notifier observable / subject that when will emit a value will complete the subscription of the search input
   *
   * @private
   * @memberof HomeComponent
   */
  private stop$: Subject<void> = new Subject<void>();

  /**
   * @description Discount offset
   * @summary
   * string for normal offset
   * Date for New sorting
   * number for algolia offset
   *
   * @private
   * @type {(string | Date | number)}
   * @memberof HomeComponent
   */
  private discountOffset: string | Date;

  /**
   * @description Algolia offset value
   *
   * @private
   * @type {number}
   * @memberof HomeComponent
   */
  private algoliaOffset: number;

  constructor(
    private distanceService: DistanceService,
    private discountService: DiscountService,
    private router: Router,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.carouselItems = [];
    this.isDiscountLoaded = false;
    this.retrieveDiscounts();
    this.retrieveCarouselImg();
  }

  /**
   * @description Get images to display in carousel
   *
   * @private
   * @memberof HomeComponent
   */
  private retrieveCarouselImg(): void {
    this.discountService.getCarouselItems().subscribe(
      (carouselItems: CarouselItem[]): void => {
        this.carouselItems = carouselItems;
      });
  }

  /**
   * @description Retrieve discounts
   *
   * @private
   * @memberof HomeComponent
   */
  private retrieveDiscounts(): void {
    this.filterService.currentFilter$
      .pipe(
        /*
         * takeUntil(notifier: Observable<any>) Operator
         * Emits the values emitted by the source Observable until a notifier Observable emits a value.
         */
        tap((): void => {
          this.isDiscountLoaded = false;
        }),
        takeUntil(this.stop$)
      )
      .subscribe((currFilter: Filter): void => {
        if (!!currFilter.searchInput && currFilter.searchInput !== Constants.empty) {
          this.currCategory = Constants.searchResultFor + currFilter.searchInput + Helper.getCurrentExSortInNames(currFilter.sort);
        } else {
          this.currCategory = currFilter.ctg + Constants.space + Constants.fbPathRefDiscountsNodeNm;
        }
        this.getAllDiscounts(currFilter); // Subscribe to current filter values.
      }, (error: any): void => {
        console.error("Unable to retrieve Discounts. Make sure you have a stable or healthy internet connection", error);
      });
  }

  /**
   * @description Get All discounts from discount service
   * @function getAllDiscounts
   * @param {Filter} currFilter
   * @private
   * @memberof HomeComponent
   */
  private getAllDiscounts(currFilter: Filter): void {
    this.discountsArr = [];
    this.discountService.getAllDiscountObj$(currFilter).subscribe(
      (discountArr: Discount[]): void => {
        this.discountsArr = discountArr;
        this.isDiscountLoaded = true;
        if (!Helper.isEmpty(discountArr)) {
          if (Helper.isAlgoliaSearch(FilterService.filter.searchInput)) {
            this.algoliaOffset = FilterService.filter.algoliaOffset;
          } else {
            this.discountOffset = FilterService.filter.sort === Constants.stringValue_One ?
              (discountArr[discountArr.length - Constants.numberValue_One]).dateCreated
              : (discountArr[discountArr.length - Constants.numberValue_One]).id;
          }
        }

      },
      (error: any): void => console.error(error),
      (): void => {
        // console.log("getAllDiscounts Observable completed")
      }
    );
  }

  /**
   * @description Download more discounts
   *
   * @private
   * @memberof HomeComponent
   */
  private retrieveMoreDiscounts(): void {
    ++FilterService.filter.page;
    this.filterService.currentFilter$.pipe(
      take(Constants.numberValue_One),
      switchMap((currFilter: Filter): Observable<Discount[]> => {
        return this.discountService
          .getAllDiscountObj$(currFilter)
          .pipe(take(Constants.numberValue_One));
      })
    ).subscribe(
      (discountArr: Discount[]): void => {
        if (!Helper.isEmpty(discountArr)) {
          this.discountsArr = this.discountsArr.concat(discountArr);
          // ++FilterService.filter.page;
          if (Helper.isAlgoliaSearch(FilterService.filter.searchInput)) {
            this.algoliaOffset = FilterService.filter.algoliaOffset;
          } else {
            this.discountOffset = FilterService.filter.sort === Constants.stringValue_One ?
              (discountArr[discountArr.length - Constants.numberValue_One]).dateCreated
              : (discountArr[discountArr.length - Constants.numberValue_One]).id;
          }
        }
      },
      (error: any): void => console.error(error),
      (): void => { }
    );
    // this.navigateHomeWithFilters();
  }

  /**
   * @function onSelectLocation
   * @summary Gets position details of the user
   * @this HomeComponent
   * @param {boolean} e Location switch on or off
   * @type void
   * @memberof HomeComponent
   */
  onSelectLocation(e: boolean): void {
    this.isLocationFilter = e;
    this.distanceService.getCurrentUserPos().then((position: any): void => {
      if (position != null) {
        this.curPosition = position;
        // this.getAllDiscounts(this.curPosition);
      }
    });
  }

  /**
   * @description Unsubscribe the search service when the component is destroyed
   * @override OnDestroy
   * @see https://www.intertech.com/Blog/angular-best-practice-unsubscribing-rxjs-observables/
   *
   * @memberof HomeComponent
   */
  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    // this.searchService.currentSearch$.unsubscribe(); // The unsubscribe method doesn't exist for a BehaviorSubject
    // Best Practice For Unsubscribing
    this.stop$.next(); // Emit a value
    this.stop$.complete();
  }

  /**
   * @description Load more discounts
   *
   * @memberof HomeComponent
   */
  public loadMore(): void {

    if (!Helper.isAlgoliaSearch(FilterService.filter.searchInput)) {
      FilterService.filter.discountOffset = this.discountOffset;
    }

    this.retrieveMoreDiscounts();
  }

}
