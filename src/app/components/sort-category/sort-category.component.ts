import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Constants } from "src/app/shared/utils/constants";
import { FormGroup, FormControl } from "@angular/forms";
import { FilterService } from "src/app/services/filter.service";

@Component({
  selector: "app-sort-category",
  templateUrl: "./sort-category.component.html",
  styleUrls: ["./sort-category.component.css"]
})
export class SortCategoryComponent implements OnInit {

  /**
   * @member currSortName
   * @description The current extra category
   * @default Deals
   * @memberof SortCategoryComponent
   * @type string
   */
  currSortName: string;

  /**
   * @description Extra SubCategory filter Form Group
   * @member sortFilterFormG
   * @type {FormGroup}
   * @memberof SortCategoryComponent
   */
  sortFilterFormG: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private filterService: FilterService) { }

  ngOnInit(): void {
    this.initFiltersValues();
  }

  /**
   * @description Read query params and set filters accordingly
   * @private
   * @member initFiltersValues
   * @memberof SortCategoryComponent
   */
  private initFiltersValues(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
        this.currSortName = params[Constants.urlsQueryParamsSort];

        this.sortFilterFormG = new FormGroup({
          sortFilterFormC: new FormControl(this.currSortName)
        });

    });
  }

  /**
   * @description Passes the current extra SubCategory type filter to DiscountService service
   * @member updateDiscountSorting
   * @memberof SortCategoryComponent
   */
  updateDiscountSorting(): void {
    this.filterService.navigateWithSort(this.sortFilterFormG.value.sortFilterFormC);
  }

}
