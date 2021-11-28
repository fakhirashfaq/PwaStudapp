import { Timestamp } from "@firebase/firestore-types";

/**
 * @description This class declares the properties of the custom user object
 *
 * @export
 * @class User
 */
export interface User {
    uid: string;
    profilePic: any;
    firstName: string;
    lastName: string;
    email: string;
    dOB: Timestamp;
    // phoneNum: string;
    gender: string;
    insId: string;
    isAccValid: boolean;
    accValidity: number;
    insEmail: string;
    regDate: Timestamp;
    regId: string;
    insNm: string;
    gradYr: number;
}
