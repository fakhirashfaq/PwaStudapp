import { Component, OnInit } from "@angular/core";
import { faCrosshairs, IconDefinition, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormControl } from "@angular/forms";
import { Constants } from "src/app/shared/utils/constants";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DistanceService } from "src/app/services/distance.service";
import { FilterService } from "src/app/services/filter.service";
import { GeoPoint } from "@angular/fire/firestore";

/**
 * @description Embody the Discount type filter switch + the location toggle radio
 * @export
 * @class DiscountTypeFilterComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-discount-type-filter",
  templateUrl: "./discount-type-filter.component.html",
  styleUrls: ["./discount-type-filter.component.css"]
})
export class DiscountTypeFilterComponent implements OnInit {

  /**
   * @description Font awesome icon - Crosshairs
   * @member faCrosshairs
   * @type {IconDefinition}
   * @memberof DiscountTypeFilterComponent
   */
  faCrosshairs: IconDefinition = faCrosshairs;

  faMapMarkerAlt: IconDefinition = faMapMarkerAlt;
  /**
   * @description Discount type filter Form Group - Has Discount location type + location toggle radio
   * @member discountTypeFilterRFormG
   * @type {FormGroup}
   * @memberof DiscountTypeFilterComponent
   */
  discountTypeFilterRFormG: FormGroup;

  /**
   * @description Is nearby discount activated
   *
   * @type {boolean}
   * @memberof DiscountTypeFilterComponent
   */
  public isNearbyFilterActive: boolean;

  /**
   * @description Selected discount type
   *
   * @type {string}
   * @memberof DiscountTypeFilterComponent
   */
  public selectedType: string;

  public isSelected: boolean;

  constructor(private filterService: FilterService, private activatedRoute: ActivatedRoute, private distanceService: DistanceService) {
  }

  ngOnInit(): void {
    this.initFiltersValues();
    this.isSelected = false;
  }

  /**
   * @description Read query params and set filters accordingly
   * @private
   * @member setFiltersValues
   * @memberof DiscountTypeFilterComponent
   */
  private initFiltersValues(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {

      this.discountTypeFilterRFormG = new FormGroup({
        discountTypeSwitchRFormC: new FormControl(params[Constants.urlsQueryParamsLocationType])
      });

      this.setSelectedTypeLbl(params[Constants.urlsQueryParamsLocationType]);

      this.isNearbyFilterActive = Boolean(JSON.parse(params[Constants.urlsQueryParamsNearby]));

    });
  }

  /**
   * @description Set selected discount type from filter
   *
   * @private
   * @param {string} currType
   * @memberof DiscountTypeFilterComponent
   */
  private setSelectedTypeLbl(currType: string): void {
    switch (currType) {
      case Constants.stringValue_Zero: {
        this.selectedType = "All";
        break;
      }
      case Constants.stringValue_One: {
        this.selectedType = "In";
        break;
      }
      case Constants.stringValue_Two: {
        this.selectedType = "On";
        break;
      }
    }
  }

  /**
   * @description Passes the current Discount type filters to DiscountService service
   * @member updateDiscountLocationType
   * @memberof DiscountTypeFilterComponent
   */
  public updateDiscountLocationType(): void {
    this.filterService.navigateWithLocation(this.discountTypeFilterRFormG.value.discountTypeSwitchRFormC);
  }

  /**
   * @description Passes the current Discount type filters to DiscountService service from dropdown - For mobile devices only
   * @member updateDiscountLocationType
   * @memberof DiscountTypeFilterComponent
   */
   public updateDiscountLocationTypeDb(dctType: string): void {
    this.filterService.navigateWithLocation(dctType);
  }

  public swapNearbyFilter(): void {
    this.isNearbyFilterActive = !this.isNearbyFilterActive;
    this.setCurrPositionInFilter();
    this.filterService.navigateWithNearby(this.isNearbyFilterActive ? Constants.numberValue_One : Constants.numberValue_Zero);
  }

  /**
   * @description Fetch current geo position and set it in Filter
   *
   * @private
   * @memberof DiscountTypeFilterComponent
   */
  private setCurrPositionInFilter(): void {
    this.distanceService.getCurrentUserPos().then(
      (position: GeoPoint): void => {
        FilterService.filter.currGeolocation = position;
      }
    ).catch((): void => {
      this.isNearbyFilterActive = false;
    }
    );
  }

}
