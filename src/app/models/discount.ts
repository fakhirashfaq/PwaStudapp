import { DocumentReference } from "@angular/fire/compat/firestore";
import { Timestamp } from "@firebase/firestore-types";

/**
 * @description Model class for Discount object
 * @param Coordinates Import Coordinate Model for Coordinate field
 * @export
 * @class Discount
 */
export interface Discount {

  /**
   * @member id
   * @description Discount Id
   * @type {string}
   * @memberof Discount
   */
  id: string;

  /**
   * @member name
   * @description Name of discount
   * @type {string}
   * @memberof Discount
   * @example Pizza
   */
  name: string;

  /**
   * @member bdRef
   * @description Reference to the buddy document
   * @type {DocumentReference}
   * @memberof Discount
   */
  bdRef: DocumentReference;

  /**
   * @description Logo image of buddy
   *
   * @type {string}
   * @memberof Discount
   */
  bdImg: string;

  /**
   * @description Buddy name
   *
   * @type {string}
   * @memberof Discount
   */
  bdNm: string;

  /**
   * @description Sub category name
   *
   * @type {string}
   * @memberof Discount
   */
  subCtg: string;

  /**
   * @member dcPct
   * @description Discount percentage
   * @type {number}
   * @memberof Discount
   */
  dcPct: number;

  /**
   * @member details
   * @description Details
   * @type {string}
   * @memberof Discount
   * @example  lorem ipsum dolor sit amet consectetur adipiscing elit
   */
  details: string;

  /**
   * @member imgUrl
   * @description Discount image URL
   * @type {string}
   * @memberof Discount
   * @example https://firebasestorage.googleapis.com/v0/b/stubud-bb83b.appspot.com/o/bottle_drink.jpg?alt=media&token=2057ba68-e7b3-4ca5-a819-43acdd499376
   */
  imgUrl: string;

  /**
   * @member likeCnt
   * @description Shakes count
   * @type {number}
   * @memberof Discount
   * @example 23
   */
  likeCnt: number;

  /**
   * @member terms
   * @description Terms and conditions of the discount
   * @type {string}
   * @memberof Discount
   * @example Red Food Shoes Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
   */
  terms: string;

  /**
   * @description Is Discount liked
   * @summary Marked as optional and will get defaulted to false when casted if origin variable doesn't have isLiked Property.
   * @type {boolean}
   * @member isLiked
   * @memberof Discount
   */
  isLiked?: boolean;

  /**
   * @description Is discount sponsored
   *
   * @type {boolean}
   * @memberof Discount
   */
  isSpons?: boolean;

  /**
   * @description Date discount was created
   *
   * @type {Date}
   * @memberof Discount
   */
  dateCreated?: Date;

  /**
   * @description Discount End Date
   *
   * @type {Date}
   * @memberof Discount
   */
   endDate?: Timestamp;

  /**
   * @description Discount type
   * @summary Offline-Online = 0, In-Store = 1, Online = 2
   *
   * @type {string}
   * @memberof Discount
   */
  type?: string;

}
