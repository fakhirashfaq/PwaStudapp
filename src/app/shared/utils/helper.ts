import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { Constants } from "./constants";

export class Helper {
  static navigateTo(router: Router, pageURL: string): void {
    router.navigate([pageURL]);
  }

  static isUserLoggedInAndValidated(user: User): boolean {
      return (user != null && user.isAccValid);
  }

  static isUserLoggedInAndNotValidated(user: User): boolean {
      return (user != null && !user);
  }

  static reloadPage(): void {
    location.reload();
  }

  static reloadPageAndNavigate(routeUrl: string, router: Router): void {
    router.navigate([routeUrl]);
    // Helper.reloadPage();
  }

  static isEmpty(array: any[]): boolean {
    return Object.keys(array).length === 0
  }

  static getCurrentExSortInNames(currExSort: string): string {
    switch (currExSort) {
      case Constants.stringValue_Zero: {
        return ", under Deals";
      }
      case Constants.stringValue_One: {
        return ", under New";
      }
      case Constants.stringValue_Two: {
        return ", under Cool";
      }
    }
  }

  /**
   * @description Check if there is a search Input for Algolia search
   *
   * @static
   * @param {string} searchInput
   * @return {*}  {boolean}
   * @memberof Helper
   */
  static isAlgoliaSearch(searchInput: string): boolean {
    return !!searchInput && searchInput  !== Constants.empty
  }
}
