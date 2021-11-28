import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LikeUnlikeService } from "src/app/services/like-unlike.service";
import { ModalService } from "src/app/services/modal.service";
import { ConvertUserComponent } from "src/app/components/convert-user/convert-user.component";

/**
 * @description Like and unLike component
 *
 * @export
 * @class LikeUnlikeComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-like-unlike",
  templateUrl: "./like-unlike.component.html",
  styleUrls: ["./like-unlike.component.css"],
})
export class LikeUnlikeComponent implements OnInit {
  /**
   * @description Current likeState of the Discount as an Input of type Checkbox
   * @type {boolean}
   * @member likeState
   * @memberof LikeUnlikeComponent
   */
  @Input() likeState: boolean;

  /**
   * @description The Discount's Id associated with this LikeUnlikeComponent instance
   * @type {string}
   * @member discountID
   * @memberof LikeUnlikeComponent
   */
  @Input() discountID: string;

  /**
   * @description Disabled like checkbox while like activity is being processed
   *
   * @type {boolean}
   * @memberof LikeUnlikeComponent
   */
  public shouldBeDisabled: boolean;

  /**
   * @description An emitter for notifier discountItem Component for like activity and increment or decrement like count locally.
   *
   * @type {EventEmitter<boolean>}
   * @memberof LikeUnlikeComponent
   */
  @Output() likeUnlikeEvtEmitter: EventEmitter<boolean>;

  constructor(
    private likeUnlikeService: LikeUnlikeService,
    private modalService: ModalService
  ) {
    this.likeUnlikeEvtEmitter = new EventEmitter<boolean>();
  }

  ngOnInit(): void { }

  /**
   * @description Switch likeState and persist like or Unlike of Discount on DB
   * @member processLikeUnlike
   * @memberof LikeUnlikeComponent
   */
  public processLikeUnlike(): void {
    if (!this.likeState) {
      // Discount liked
      this.shouldBeDisabled = true;
      this.likeState = !this.likeState;
      this.likeUnlikeService
        .likeDiscount(this.discountID)
        .then((): void => {
          this.shouldBeDisabled = false; // Re-enabled like checkbox
          this.likeUnlikeEvtEmitter.emit(true); // Notify parent component discount was liked
        })
        .catch((error: any): void => {
          if (!!!error) {
            this.modalService.init(ConvertUserComponent, {}, {});
          } else {
            console.log("Unable to like discount", error);
          }
          this.shouldBeDisabled = false; // Re-enabled like checkbox
          this.likeState = !this.likeState; // revert likeState value on error
        });
    } else {
      // User unliked
      this.shouldBeDisabled = true;
      this.likeState = !this.likeState;
      this.likeUnlikeService
        .unlikeDiscount(this.discountID)
        .then((): void => {
          this.shouldBeDisabled = false; // Re-enabled like checkbox
          this.likeUnlikeEvtEmitter.emit(false); // Notify parent component discount was disliked
        })
        .catch((error: any): void => {
          if (!!!error) {
            this.modalService.init(ConvertUserComponent, {}, {});
          } else {
            console.log("Unable to like discount", error);
          }
          this.shouldBeDisabled = false; // Re-enabled like checkbox
          this.likeState = !this.likeState; // revert likeState value on error
        });
    }
  }
}
