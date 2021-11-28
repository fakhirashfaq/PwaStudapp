import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { defaultIfEmpty, switchMap } from "rxjs/operators";
import { Discount } from "src/app/models/discount";
import { DiscountService } from "src/app/services";
import { LikeUnlikeService } from "src/app/services/like-unlike.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.css"]
})
export class FavoritesComponent implements OnInit {

  /**
   * @description Is Discount loaded
   *
   * @type {boolean}
   * @memberof FavoritesComponent
   */
  public isDiscountLoaded: boolean;

  /**
   * @description Array of liked discounts
   *
   * @type {Discount[]}
   * @memberof FavoritesComponent
   */
  public discountsArr: Discount[];

  constructor(private likeUnlikeService: LikeUnlikeService, private discountService: DiscountService) { }

  ngOnInit(): void {
    this.isDiscountLoaded = false;
    this.retrieveLikedDiscounts();
  }

  /**
   * @description Retrieve discounts liked by user
   *
   * @private
   * @memberof FavoritesComponent
   */
  private retrieveLikedDiscounts(): void {
    this.discountsArr = [];
    this.likeUnlikeService.retrieveLikedDiscountsId().pipe(
      switchMap(
        (likedDiscountArr: string[]): Observable<Discount[]> => {
          const obs$: Observable<Discount>[] = likedDiscountArr.map((discountId: string): Observable<Discount> => {
            return this.discountService.getDiscountCollFromDbViaID$(discountId);
          });
          return forkJoin(obs$).pipe(
            defaultIfEmpty(null), // Default value in case of no discounts liked so that forkJoin completes
          );
        }
      )
    ).subscribe(
      (payload: Discount[]): void => {
        this.discountsArr = !!payload ? payload.filter((x: Discount): boolean => x !== undefined) : payload; // Removed undefined (Deleted discounts)
      }
      , (error: any): void => {
        console.error("Error fetching liked discounts", error);
      }
      , (): void => {
        // console.log("Retrived liked discounts completed")
        this.isDiscountLoaded = true;
      });
  }

}
