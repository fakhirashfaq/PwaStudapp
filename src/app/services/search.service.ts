import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import algoliasearch from "algoliasearch";
import { environment } from "src/environments/environment";
import { Constants } from "../shared/utils/constants";
import { Filter } from "../models/filter";
import { FilterService } from "./filter.service";

/**
 * @description A service for communicating Search input to required components.
 * @export
 * @class SearchService
 */
@Injectable({
  providedIn: "root", // We declare that this service should be created by the root application injector.
})
export class SearchService {
  static readonly searchClient: any = algoliasearch(
    environment.algolia.appId,
    environment.algolia.apiKey
  );

  private discountSearch: any;

  constructor() {
    this.discountSearch = SearchService.searchClient.initIndex(
      Constants.fbPathRefDiscountsNodeNm
    );
  }

  public searchDiscounts(filter: Filter): any {
    return this.discountSearch.search(filter.searchInput, {
      filters: this.filterBuilder(filter),
      attributesToRetrieve: [Constants.algoliaAtrObjId],
      hitsPerPage: 6,
      offset: FilterService.filter.algoliaOffset,
      length: 6
    });
  }

  /**
   * @description Build algolia filter based on set filter
   *
   * @private
   * @param {Filter} filter
   * @returns {string}
   * @memberof SearchService
   */
  private filterBuilder(filter: Filter): string {
    let filterStr: string = Constants.empty;

    // Category filter - Category filter disabled

    // if (filter.ctg !== Constants.defFilterCtg) {
    //   filterStr =
    //     Constants.algoliaAtrSubCtg +
    //     Constants.colonSign +
    //     Constants.doubleQuotes +
    //     filter.ctg +
    //     Constants.doubleQuotes;
    //   console.log(filterStr);
    // }

    // Location filter
    if (Constants.stringValue_Zero !== filter.discountLocationTypeFilter) {
      filterStr = !filterStr.length
        ? Constants.algoliaAtrType + Constants.colonSign + filter.discountLocationTypeFilter
        : filterStr + Constants.space + Constants.AND + Constants.space +
          Constants.algoliaAtrType + Constants.colonSign + filter.discountLocationTypeFilter;
    }

    // Sort filter
    if (Constants.stringValue_Two === filter.sort) {
      filterStr = !filterStr.length
        ? Constants.algoliaAtrIsSpons + Constants.colonSign + true
        : filterStr + Constants.space + Constants.AND + Constants.space + Constants.algoliaAtrIsSpons + Constants.colonSign + true;
    }

    // Filter for un-archived discount
    filterStr = !filterStr.length
    ? Constants.NOT + Constants.space + Constants.isArch + Constants.colonSign + true
    : filterStr + Constants.space + Constants.AND + Constants.space +
      Constants.NOT + Constants.space + Constants.isArch + Constants.colonSign + true;

    console.log(filterStr);
    return filterStr;
  }
}
