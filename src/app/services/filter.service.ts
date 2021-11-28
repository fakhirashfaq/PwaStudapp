import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ReplaySubject, Observable, BehaviorSubject } from "rxjs";
import { Filter } from "../models/filter";
import { Constants } from "../shared/utils/constants";
import { SearchService } from "./search.service";

@Injectable({
  providedIn: "root"
})
export class FilterService {

  static filter: Filter;

  /**
   * @description Observable filter sources
   * @summary filterSource will hold applying filters
   *
   * @tutorial ReplaySubject: The ReplaySubject is comparable to the BehaviorSubject in the way that 
   * it can send “old” values to new subscribers.
   * It however has the extra characteristic that it can record a part of the observable execution 
   * and therefore store multiple old values and “replay” them to new subscribers.
   *
   * @private
   * @member filterSource
   * @memberof FilterService
   */
  private filterSource: ReplaySubject<Filter>;

  /**
   * @description Observable filter streams
   * @summary currentFilter$ is an Observable<Filter> created from a subject (ReplaySubject)
   * which was itself converted into an observable using the asObservable method
   * @tutorial Creates a new Observable with this Subject as the source.
   * You can do this to create customize Observer-side logic of the Subject and conceal it from code that uses the Observable.
   * @type {Observable<Filter>}
   * @member currentFilter$
   * @memberof FilterService
   */
  public currentFilter$: Observable<Filter>;

  /**
   * @description Instantiate FilterService service to be used by any components that subscribe.
   * @summary Will instantiate default filter object and set it as initial filter stream
   * @param {AngularFirestore} angularFirestore
   * @memberof FilterService
   */
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) {
    FilterService.filter = {};
    this.filterSource = new ReplaySubject(Constants.numberValue_One);
    this.currentFilter$ = this.filterSource.asObservable();
    this.listenQueryFilters();
  }

  /**
   * @description Listen and subscribe to query params and update filter values
   * @private
   * @member listenQueryFilters
   * @memberof FilterService
   */
  private listenQueryFilters(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {

      if (this.isFilterValid(params)) {
        FilterService.filter.sort = params[Constants.urlsQueryParamsSort];

        FilterService.filter.discountLocationTypeFilter = params[Constants.urlsQueryParamsLocationType];

        FilterService.filter.searchInput = params[Constants.urlsQueryParamsTxtSearch];

        FilterService.filter.ctg = params[Constants.urlsQueryParamsCategory];

        FilterService.filter.nearby = params[Constants.urlsQueryParamsNearby];

        FilterService.filter.discountOffset = Constants.empty;

        FilterService.filter.algoliaOffset = Constants.numberValue_Zero;

        FilterService.filter.page = (FilterService.filter.page)
        ? FilterService.filter.page : Constants.numberValue_One;

        this.filterSource.next(FilterService.filter);
      } else if (Constants.routePage_Home === this.router.url.split(Constants.questionMark)[Constants.numberValue_Zero] ) {
        this.navigateHomeDefFilters();
      }

    });
  }

  private isFilterValid(params: Params): boolean {
    return !!params[Constants.urlsQueryParamsSort]
    && !!params[Constants.urlsQueryParamsLocationType]
    && !!params[Constants.urlsQueryParamsCategory];
  }

  public navigateWithLocation(location: string): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: location,
        category: FilterService.filter.ctg,
        sort: FilterService.filter.sort,
        nearby: FilterService.filter.nearby,
        search: FilterService.filter.searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

  public navigateWithCategory(category: string): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: FilterService.filter.discountLocationTypeFilter,
        category: category,
        sort: FilterService.filter.sort,
        nearby: FilterService.filter.nearby,
        search: FilterService.filter.searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

  public navigateWithSort(sort: string): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: FilterService.filter.discountLocationTypeFilter,
        category: FilterService.filter.ctg,
        sort: sort,
        nearby: FilterService.filter.nearby,
        search: FilterService.filter.searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

  public navigateWithNearby(nearby: number): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: FilterService.filter.discountLocationTypeFilter,
        category: FilterService.filter.ctg,
        sort: FilterService.filter.sort,
        nearby: nearby,
        search: FilterService.filter.searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

  public navigateWithSearch(searchInput: string): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: FilterService.filter.discountLocationTypeFilter,
        category: FilterService.filter.ctg,
        sort: FilterService.filter.sort,
        nearby: FilterService.filter.nearby,
        search: searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

  public navigateHomeDefFilters(): void {
    this.router.navigate([Constants.routePage_Home], {
      queryParams: {
        location: Constants.defFilterLocation,
        category: Constants.defFilterCtg,
        sort: Constants.defFilterSort,
        nearby: Constants.defFilterNearby,
        search: FilterService.filter.searchInput
      },
      // queryParamsHandling: "merge" // Merge new with current parameters
    });
  }

}
