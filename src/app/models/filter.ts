import FirebaseFirestore from "@firebase/firestore-types";

/**
 * @description Model class for Filter object
 *
 * @export
 * @interface Filter
 */
export interface Filter {

    /**
     * @description Search input
     * @member searchInput
     * @type {string}
     * @memberof Filter
     */
    searchInput?: string;

    /**
     * @description Category
     * @member ctg
     * @type {string}
     * @memberof Filter
     */
    ctg?: string;

    /**
     * @description sort category options
     * @member sort
     * @type {string}
     * @memberof Filter
     */
    sort?: string;

    /**
     * @description Offline or Online discounts filtering
     * @member discountLocationTypeFilter
     * @type {string}
     * @memberof Filter
     */
    discountLocationTypeFilter?: string;

    discountLocationTypeGeoToggle?: boolean;

    /**
     * @description The last discounts downloaded id used as an offset for the next batch of discounts
     *
     * @type {string}
     * @memberof Filter
     */
    discountOffset?: string | Date;

    /**
     * @description Pagination system. Will specify the amount of discounts to download per get
     *
     * @type {number}
     * @memberof Filter
     */
    page?: number;

    /**
     * @description Filter for nearby discounts
     * @summary 1 activates nearby discounts and 0 deactivate it
     * @type {string}
     * @memberof Filter
     */
    nearby?: string;

    /**
     * @description User current geo location
     *
     * @type {FirebaseFirestore.GeoPoint}
     * @memberof Filter
     */
    currGeolocation?: FirebaseFirestore.GeoPoint;

    /**
     * @description The offset value for Algolia
     *
     * @type {number}
     * @memberof Filter
     */
    algoliaOffset?: number;

}
