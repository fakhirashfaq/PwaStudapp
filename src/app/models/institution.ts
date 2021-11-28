export interface Institution {
    /**
     * @description Country code of Institution
     *
     * @type {string}
     * @memberof Institution
     */
    alpha_two_code: string;
    /**
     * @description Country of Institution
     *
     * @type {string}
     * @memberof Institution
     */
    country: string;
    /**
     * @description Email domain of Institution
     *
     * @type {Array<string>}
     * @memberof Institution
     */
    domains: Array<string>;
    /**
     * @description Is Stubud services available for Institution
     *
     * @type {boolean}
     * @memberof Institution
     */
    isStubudAvbl: boolean;
    /**
     * @description Name of Institution
     *
     * @type {string}
     * @memberof Institution
     */
    name: string;
    /**
     * @description Home Page of Institution
     *
     * @type {Array<string>}
     * @memberof Institution
     */
    web_pages: Array<string>;
}
