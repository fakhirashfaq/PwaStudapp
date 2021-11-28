// import FirebaseFirestore from "@firebase/firestore-types";

import { WhereFilterOp } from "@firebase/firestore";


export class Constants {

  static readonly businessName: string = "Stubud";
  static readonly tabsName: string = "STUBUD | Student Discount";

  static readonly empty: string = "";

  static readonly homePageTitle: string = "Home";
  static readonly buddiesPageTitle: string = "Buddies";
  static readonly discountDetailsPageTitle: string = "Discount Details";
  static readonly buddyDetailsPageTitle: string = "Buddy Details";
  static readonly myBuddiesPageTitle: string = "My Buddies";
  static readonly institutionsPageTitle: string = "Institutions";
  static readonly loginPageTitle: string = "Login";
  static readonly changePassPageTitle: string = "Change Password";
  static readonly resetPassPageTitle: string = "Reset Password";
  static readonly registerPageTitle: string = "Register";
  static readonly discountPageTitle: string = "discount";

  static readonly routePage_Home: string = "/home";
  static readonly routePage_404: string = "404";
  static readonly routePage_Register: string = "auth/register";
  static readonly routePage_CreateAccount: string = "auth/register/create-account";
  static readonly routePage_YourDetails: string = "auth/register/your-details";
  static readonly routePage_YourInstitution: string = "auth/register/your-institution";
  static readonly routePage_VerifyInstitution: string = "auth/register/verify-institution";
  static readonly routePage_ChangePass: string = "auth/change-password";
  static readonly routePage_User: string = "/user";

  static readonly delimiter: string = " | ";
  static readonly slash: string = "/";
  static readonly space: string = " ";
  static readonly questionMark: string = "?";
  static readonly equalsSign: string = "=";
  static readonly colonSign: string = ":";
  static readonly newLine: string = "\n";
  static readonly doubleQuotes: string = "\"";
  static readonly at: string = "@";

  static readonly fbPathRefDiscountsNode: string = "/discounts";
  static readonly fbPathRefArchDiscountsNode: string = "/archDiscounts";
  static readonly fbPathRefCategoriesNode: string = "/categories";
  static readonly fbPathRefUsersNode: string = "/users";
  static readonly fbPathRefProfilePics: string = "/profilePics";
  static readonly fbPathRefBuddiesNode: string = "/buddies";
  static readonly fbPathRefLikesNode: string = "/likes";
  static readonly fbPathRefRegionsNode: string = "/regions";
  static readonly fbPathRefInstitutionsNode: string = "/institutions";
  static readonly fbPathRefSubscriptionsNode: string = "/subscriptions";
  static readonly fbPathRefDiscountsUpdatesDoc: string = "/subscriptions/discountsUpdates";
  static readonly fbPathRefFaqsFeedbackDoc: string = "/faqs/feedback";
  static readonly fbPathRefVcodesNode: string = "/vcodes";
  static readonly fbPathRefOnGoingVcodesNode: string = "/ogvcodes";
  static readonly fbPathRefEpheVcodesData: string = "/epheVcodesData";
  static readonly fbPathRefUsedVcodesNode: string = "/usedvcodes";
  static readonly fbPathRefUsedCarouselNode: string = "/carousel";
  // static readonly fbPathRefCarouselDoc: string = "/assetsUtil/carousel";


  static readonly fbPathRefDiscountsNodeNm: string = "discounts";
  static readonly fbPathRefCategoriesNodeNm: string = "categories";
  static readonly stoPathRefProfilePicsNodeNm: string = "profilePics";

  static readonly stubudBlueColor: string = "#04a3ff";

  static readonly pageLoadingVisualStatus_Hidden: string = "hidden";
  static readonly pageLoadingVisualStatus_Visible: string = "visible";

  static readonly defaultProfilePic: string = "../../../assets/img/defProfPic.jpg";

  static readonly uploadsFormatType: string = "data_url"; // Data URL string

  static readonly stringValue_Zero: string = "0"; // discountLocationType_All, Deals, Discount.type Offline-Online
  static readonly stringValue_One: string = "1"; // discountLocationType_InStore, New, Discount.type In-Store
  static readonly stringValue_Two: string = "2"; // discountLocationType_Online, Cool, Discount.type Online
  static readonly stringValue_Three: string = "3";

  static readonly numberValue_One: number = 1; // discountLocationType_InStore
  static readonly numberValue_Zero: number = 0;
  static readonly numberValue_Five: number = 5;
  static readonly numberValue_six: number = 6;
  static readonly numberValue_Ten: number = 10;
  static readonly numberValue_Twenty: number = 20;
  static readonly numberValue_TwentyFour: number = 24;
  static readonly numberValue_Forty: number = 40;
  static readonly numberValue_Sixty: number = 60;
  static readonly numberValue_Eighty: number = 80;
  static readonly numberValue_Hundred: number = 100;
  static readonly numberValue_Thousand: number = 1000;

  static readonly urlsQueryParamsLocationType: string = "location";
  static readonly urlsQueryParamsCategory: string = "category";
  static readonly urlsQueryParamsSort: string = "sort";
  static readonly urlsQueryParamsTxtSearch: string = "search";
  static readonly urlsQueryParamsPage: string = "page";
  static readonly urlsQueryParamsNearby: string = "nearby";

  static readonly defaultUrl: string = "/home?location=0&category=All&sort=0&nearby=0";
  static readonly defFilterLocation: string = "0";
  static readonly defFilterCtg: string = "All";
  static readonly defFilterSort: string = "0";
  static readonly defFilterNearby: string = "0";

  /* Variables */
  static readonly id: string = "id";
  static readonly uid: string = "uid";
  static readonly dcId: string = "dcId";
  static readonly genCode: string = "genCode";
  static readonly lastGeneCode: string = "lastGeneCode";
  static readonly bd_ref: string = "bdRef";
  static readonly imgUrl: string = "imgUrl";
  static readonly bdNm: string = "bdNm";
  static readonly insEmail: string = "insEmail";
  static readonly vUid: string = "vUid";
  static readonly endDate: string = "endDate";
  static readonly dcPct: string = "dcPct";
  static readonly genDisc: string = "genDisc";

  /* Literals */
  static readonly stringValue_true: string = "true";
  static readonly stringValue_false: string = "false";

  /* Algolia filers Variables */
  static readonly algoliaAtrObjId: string = "objectID";
  static readonly algoliaAtrType: string = "type";
  static readonly algoliaAtrSubCtg: string = "subCtg";
  static readonly algoliaAtrIsSpons: string = "isSpons";
  static readonly algoliaAtrDateCreated: string = "dateCreated";
  static readonly isArch: string = "isArch";

  /* Conditions */
  static readonly equals: WhereFilterOp = "==";
  static readonly notEquals: WhereFilterOp = "!=";
  static readonly greaterThan: WhereFilterOp = ">";
  static readonly smallerEqualThan: WhereFilterOp = "<=";
  static readonly AND: string = "AND";
  static readonly NOT: string = "NOT";

  /* Business Rules */
  static readonly ageLimitRegistration: number = 2006;
  static readonly PASSWORD_MIN_SIZE: number = 8;

  /* Business Label */
  static readonly type_Online: string = "Online";
  static readonly type_InStore: string = "In-Store";
  static readonly type_OfflineOnline: string = "Offline-Online";
  static readonly domain: string = "https://stubud-bb83b.firebaseapp.com";

  /* Form Controls */
  static readonly emailFormC: string = "emailFormC";
  static readonly buddyIdFormC: string = "bdId";
  static readonly buddyObjFormC: string = "buddyObj";
  static readonly imgFormC: string = "img";
  static readonly latFormC: string = "lat";
  static readonly lngFormC: string = "lng";
  static readonly tagObjFormC: string = "tagObj";
  static readonly passFormC: string = "passFormC";
  static readonly passConFormC: string = "passConFormC";
  static readonly dobDayFormC: string = "dobDayFormC";
  static readonly dobMonthFormC: string = "dobMonthFormC";
  static readonly dobYearFormC: string = "dobYearFormC";

  /* General strings */
  static readonly searchResultFor: string = "Search results for: ";
  static readonly showTAndC: string = "Show";
  static readonly hideTAndC: string = "Hide";
  static readonly supportEmail: string = "mailto:services@stubud.com?subject=Support";

  /* Cloud functions */
  static readonly cloudFunctionSendVerifyInsMail: string = "sendVerifyInsMail";
  static readonly cloudFunctionSendSubscribeNewsletterMail: string = "sendSubscribeNewsletterMail";
  static readonly cloudFunctionManualVerificationMail: string = "manualVerificationMail";
  static readonly cloudFunctionDeleteUserAcc: string = "deleteUserAcc";

  static readonly categories: { category: string; subCategory: { name: string; }[]; }[] = [
    {
      category: "All",
      subCategory: [

      ]
    },
    {
      category: "Food & Drink",
      subCategory: [
        { name: "Takeaway & Fast Food" },
        { name: "Restaurants" },
        { name: "SuperMarkets" },
        { name: "Bars & Lounge" }
      ]
    },
    {
      category: "Fashion",
      subCategory: [
        { name: "Women Fashion" },
        { name: "Men Fashion" },
        { name: "Sport Wears" },
        { name: "Accessories" },
        { name: "Shoes" },
        { name: "Hair & Makeup" },
        { name: "Fragrances" }
      ]
    },
    {
      category: "Tech",
      subCategory: [
        { name: "Airtime & Data" },
        { name: "Phones" },
        { name: "Laptop & Tablet" },
        { name: "Media" },
        { name: "App" },
        { name: "Gaming" },
        { name: "Electonic/ Accessories" },
      ]
    },
    {
      category: "Leisure",
      subCategory: [
        { name: "Cinema" },
        { name: "Activities" },
        { name: "Holiday" },
        { name: "Hotel & Hostel" },
        { name: "Taxis & Transportation" }
      ]
    },
    {
      category: "Health",
      subCategory: [
        { name: "Fitness" },
        { name: "Sport Gears" },
        { name: "Optician" },
        { name: "Dentist" },
        { name: "Pharmacy" },
        { name: "Nutrition" },
        { name: "Adult" }
      ]
    },
    {
      category: "Utilities",
      subCategory: [
        { name: "Stationary" },
        { name: "Cards" },
        { name: "Books" },
        { name: "Printing" },
        { name: "Homeware" },
        { name: "Banking" }
      ]
    },
  ];

}
