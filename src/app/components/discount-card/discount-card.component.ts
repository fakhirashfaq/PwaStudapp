import { Component, Input, OnInit } from "@angular/core";
import { Institution } from "src/app/models/institution";
import { User } from "src/app/models/user";
import { InstitutionsService } from "src/app/services/institutions.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-discount-card",
  templateUrl: "./discount-card.component.html",
  styleUrls: ["./discount-card.component.css"]
})
export class DiscountCardComponent implements OnInit {

  /**
   * @description Current logged in User
   *
   * @type {currUser}
   * @memberof DiscountCardComponent
   */
  @Input() currUser: User;

  /**
   * @description Current user's profile pic
   *
   * @type {string}
   * @memberof DiscountCardComponent
   */
  public profPic: string;

  constructor(private institutionService: InstitutionsService) {
  }

  ngOnInit(): void {
    this.profPic = this.currUser.profilePic ? this.currUser.profilePic : Constants.defaultProfilePic;
    if (!!this.currUser.insId) {
      this.fetchInsNm();
    }
  }

  /**
   * @description Fetch user's institution name
   *
   * @private
   * @memberof DiscountCardComponent
   */
  private fetchInsNm(): void {
    this.institutionService.retrieveInstitution$(this.currUser.insId)
    .subscribe((institution: Institution): void => {
      this.currUser.insNm = institution.name;
    });
  }

  /**
   * @description Set discount status label
   *
   * @returns {string}
   * @memberof DiscountCardComponent
   */
  public setDiscountCardStatus(): string {
    if (this.currUser.isAccValid) {
      return !!this.currUser.profilePic ? "Valid" : "Almost";
    } else {
      return "Invalid";
    }
  }

  /**
   * @description Set discount status style
   *
   * @returns {string}
   * @memberof DiscountCardComponent
   */
  public setDiscountCardStyling(): string {
    if (this.currUser.isAccValid) {
      return !!this.currUser.profilePic ? "statusValid" : "almostValid";
    } else {
      return "statusInvalid";
    }
  }

}
