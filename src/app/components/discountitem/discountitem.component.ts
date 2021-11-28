import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router"; // Use Router class to obtain functions for navigation in code
import { Discount } from "src/app/models";
import { LikeUnlikeService } from "src/app/services/like-unlike.service";
import { QuerySnapshot, DocumentData } from "@angular/fire/compat/firestore";
import { Constants } from "src/app/shared/utils/constants";

/**
 * @description A discount item as listed in HomePage
 * @export
 * @class DiscountItemComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-discountitem",
  templateUrl: "./discountitem.component.html",
  styleUrls: ["./discountitem.component.css"]
})
export class DiscountItemComponent implements OnInit {


  /**
   * @description The Discount data
   * @type {Discount}
   * @member discount
   * @memberof DiscountItemComponent
   */
  @Input() discount: Discount;

  /**
   * @description Is discount end Date less than or equal 5 days
   *
   * @type {boolean}
   * @memberof DiscountItemComponent
   */
  public isEnding: boolean;

  /**
   * @description Number of days left before discount ends
   *
   * @type {number}
   * @memberof DiscountItemComponent
   */
  public endingDay: number;

  constructor(private router: Router, private likeUnLikeService: LikeUnlikeService) {
  }

  ngOnInit(): void {
    this.isEnding = false;
    this.setDiscountLike();
    this.setDiscountEndDate();
  }

  /**
   * @description Set discount Like/Unlike Status
   * @function
   * @private
   * @member setDiscountLike
   * @memberof DiscountItemComponent
   */
  private setDiscountLike(): void {
    this.likeUnLikeService.isLikeExistOnDb(this.discount.id).subscribe(
      (result: QuerySnapshot<DocumentData>): void => {
      this.discount.isLiked = (!!result) ? !(!!result.empty) : false;
    });
  }

  /**
   * @description Set if discount is ending
   *
   * @private
   * @memberof DiscountItemComponent
   */
  private setDiscountEndDate(): void {
    this.endingDay = this.getDaysLeft();
    if (this.endingDay <= Constants.numberValue_Five) {
      this.isEnding = true;
    }
  }

  /**
   * @description Get number of days left
   *
   * @returns {number}
   * @memberof DiscountItemComponent
   */
  public getDaysLeft(): number {
    return Math.ceil(
      (this.discount.endDate?.toDate().getTime() - new Date().getTime())
       / (Constants.numberValue_Thousand * Constants.numberValue_Sixty * Constants.numberValue_Sixty * Constants.numberValue_TwentyFour));
  }

  /**
   * @description Persist like action on UI
   *
   * @param {boolean} isLiked
   * @memberof DiscountItemComponent
   */
  public persistLikeUnlikeLocal(isLiked: boolean): void {
    if (isLiked) { // Discount liked
      this.discount.likeCnt++;
    } else {
      this.discount.likeCnt--;
    }
  }

  /**
   * @description Get Discount type label
   *
   * @param {string} type
   * @return {*}  {string}
   * @memberof DiscountItemComponent
   */
  public getTypeLabel(type: string): string {
    if (type === Constants.stringValue_Zero) {
      return Constants.type_OfflineOnline;
    } else if (type === Constants.stringValue_One) {
      return Constants.type_InStore;
    } else if (type === Constants.stringValue_Two) {
      return Constants.type_Online;
    }
  }

}
