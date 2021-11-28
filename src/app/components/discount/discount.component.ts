import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Constants } from "src/app/shared/utils/constants";
import { take } from "rxjs/operators";
import { Discount, Buddy } from "src/app/models";
import { QuerySnapshot, DocumentData } from "@angular/fire/compat/firestore";
import { LikeUnlikeService } from "src/app/services/like-unlike.service";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { ModalService } from "src/app/services/modal.service";
import { ConvertUserComponent } from "../convert-user/convert-user.component";
import { IconDefinition, faLink, faMapMarkedAlt, faExternalLinkAlt, faCopy, faDirections } from "@fortawesome/free-solid-svg-icons";
import { Location } from "@angular/common";
import { VcodeService } from "src/app/services/vcode.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Point } from "src/app/models/point";

/**
 * @description Discount Page
 *
 * @export
 * @class DiscountComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.css"],
})
export class DiscountComponent implements OnInit {

  faLink: IconDefinition;
  faMapMarkedAlt: IconDefinition;
  faExternalLinkAlt: IconDefinition;
  faCopy: IconDefinition;
  faDirections: IconDefinition;

  /**
   * @description Current discount loaded
   * @type {Discount}
   * @member currDiscount
   * @memberof DiscountComponent
   */
  public currDiscount: Discount;

  /**
   * @description Current loaded buddy
   * @type {Buddy}
   * @member currBuddy
   * @memberof DiscountComponent
   */
  public currBuddy: Buddy;

  private currUser: User;

  /**
   * @description Array of location for In Store buddies
   *
   * @type {string[]}
   * @memberof DiscountComponent
   */
  public locations: Point[];

  /**
   * @description Downloaded voucher code
   *
   * @type {string}
   * @memberof DiscountComponent
   */
  public vcode: string;

  /**
   * @description boolean if no vcode is available
   *
   * @type {boolean}
   * @memberof DiscountComponent
   */
  public novcode: boolean;

  /**
   * @description Can user generate a code
   *
   * @type {boolean}
   * @memberof DiscountComponent
   */
  public canGenerate: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private likeUnlikeService: LikeUnlikeService,
    private authService: AuthService,
    private modalService: ModalService,
    private location: Location,
    private vcodeService: VcodeService,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setResolvedData();
    this.getCurrentUser();
    this.vcode = null;
    this.novcode = false;
    this.canGenerate = true;
    this.faLink = faLink;
    this.faMapMarkedAlt = faMapMarkedAlt;
    this.faExternalLinkAlt = faExternalLinkAlt;
    this.faCopy = faCopy;
    this.faDirections = faDirections;
  }

  /**
   * @description Set resolved discount and buddy
   *
   * @private
   * @memberof DiscountComponent
   */
  private setResolvedData(): void {
    this.activatedRoute.data.pipe(take(Constants.numberValue_One))
      .subscribe((resolvedValue: any): void => {
        this.currDiscount = resolvedValue.resolvedDiscountAndBuddy.discount;
        this.currBuddy = resolvedValue.resolvedDiscountAndBuddy.buddy;
      });
  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof DiscountComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.subscribe((user: User): void => {
      if (!!user) {
        this.currUser = user;
        this.setLikeStatus();
      }
    });
  }


  /**
 * @description Set discount Like/Unlike Status
 * @function
 * @private
 * @member setLikeStatus
 * @memberof DiscountComponent
 */
  private setLikeStatus(): void {
    this.likeUnlikeService.isLikeExistOnDb(this.currDiscount.id).subscribe(
      (result: QuerySnapshot<DocumentData>): void => {
        this.currDiscount.isLiked = (!!result) ? !(!!result.empty) : false;
      });
  }

  /**
   * @description Generate Code. Show ConvertUserComponent if user is not logged in
   *
   * @memberof DiscountComponent
   */
  public generateCode(): void {
    if (!!this.currUser) {
      if (this.currUser.isAccValid) {
        this.loadingBar.start(); // Start loading bar
        this.vcodeService.isAllowedToGenerate(this.currUser.uid, this.currDiscount.id).then((isAllowed: boolean): void => {
          if (isAllowed) {
            this.canGenerate = true;
            this.vcodeService.getCode(this.currDiscount.id, this.currUser.uid, this.currBuddy.id).then(
              (code: string): void => {
                if (!!code) {
                  this.vcode = code;
                  this.novcode = null;
                } else {
                  this.novcode = true;
                }
                this.loadingBar.complete(); // stop loading bar
              }
            ).catch((error: any): void => {
              console.error(error);
              this.loadingBar.complete();
            });
          } else {
            this.canGenerate = false;
            this.loadingBar.complete(); // stop loading bar
          }
        });
      } else {
        this.router.navigate([Constants.routePage_Register]);
      }
    } else {
      this.modalService.init(ConvertUserComponent, {}, {});
    }

  }

  /**
   * @description Navigate to Google Maps if signed in
   *
   * @memberof DiscountComponent
   */
  public showLocations(): void {
    if (!!this.currUser) {
      if (this.currUser.isAccValid) {
        this.locations = this.currBuddy.points
        .filter((location: Point): boolean => location.isDiscountProvided);
      } else {
        this.router.navigate([Constants.routePage_CreateAccount]);
      }
    } else {
      this.modalService.init(ConvertUserComponent, {}, {});
    }
  }

  /**
   * @description Copy current link to clipboard
   *
   * @memberof DiscountComponent
   */
  public copyToClipboard(): void {

    const dummy: HTMLInputElement = document.createElement("input");
    const text: string = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select(); // selects all the text in a <textarea> element or in an <input> element that includes a text field
    document.execCommand("copy"); // Copy to the clipboard
    document.body.removeChild(dummy); // clean up the mess instead of setting input to hidden and polluting the DOM
  }

  /**
   * @description Copy Vcode to Clipboard
   *
   * @memberof DiscountComponent
   */
  public copyVcodeToClipboard(): void {
    const dummy: HTMLInputElement = document.createElement("input");
    const text: string = this.vcode;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select(); // selects all the text in a <textarea> element or in an <input> element that includes a text field
    document.execCommand("copy"); // Copy to the clipboard
    document.body.removeChild(dummy); // clean up the mess instead of setting input to hidden and polluting the DOM
  }

  /**
   * @description Go back to previous page
   *
   * @memberof DiscountComponent
   */
  public goBack(): void {
    this.location.back();
  }
}
