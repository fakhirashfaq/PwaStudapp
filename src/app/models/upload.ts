import { Constants } from "../shared/utils/constants";

/**
 * @description This class declares the properties of the custom Upload object
 *
 * @export
 * @class Upload
 */
export class Upload {

    base64Value: string;

    /**
     * @description User uid as name
     *
     * @type {string}
     * @memberof Upload
     */
    name: string;

    formatType: string;

    constructor(name: string, base64Url: string) {
        this.name = name;
        this.base64Value = base64Url; // Data URL string
        this.formatType = Constants.uploadsFormatType;
    }

}
