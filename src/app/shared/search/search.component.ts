import { Component, OnInit } from "@angular/core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Constants } from "../utils/constants";
import { FilterService } from "src/app/services/filter.service";

/**
 * @description The Search bar for searching for discounts
 * @param SearchService For passing the search input to the SearchService
 * @export
 * @class SearchComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {

  faSearch: any = faSearch;

  /**
   * @description Current value in Search Bar
   * @type {string}
   * @member input
   * @memberof SearchComponent
   */
  public input: string;

  constructor(private activatedRoute: ActivatedRoute, private filterService: FilterService) { }

  ngOnInit(): void {
    this.initFiltersValues();
  }

  /**
   * @description Read query params and set filters accordingly
   * @private
   * @member initFiltersValues
   * @memberof SearchComponent
   */
  private initFiltersValues(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      this.input = (params[Constants.urlsQueryParamsTxtSearch]) ? params[Constants.urlsQueryParamsTxtSearch] : Constants.empty;
    });
  }

  /**
   * @description Receive search input from the search bar (input) and navigate with search
   *
   * @param {string} searchInput
   * @memberof SearchComponent
   */
  public onSearchDiscount(searchInput: string): void {
    this.filterService.navigateWithSearch(searchInput);
  }

  /**
   * @description Clear current search Input
   * @member clear
   * @memberof SearchComponent
   */
  public clear(): void {
    this.filterService.navigateWithSearch(Constants.empty);
  }

}
