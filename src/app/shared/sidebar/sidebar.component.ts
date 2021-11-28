import { Component, Input, OnInit } from "@angular/core";
import { faHome, faCog, faUserCircle, faUser, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { FilterService } from "src/app/services/filter.service";
import { Constants } from "../utils/constants";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {

  /**
   * @description Home button to navigate to Home button
   *
   * @type {IconDefinition}
   * @memberof SidebarComponent
   */
  public faHome: IconDefinition;

  /**
   * @description Settings
   *
   * @type {IconDefinition}
   * @memberof MyStubudComponent
   */
  faCog: IconDefinition = faCog;

  /**
   * @description User icon
   *
   * @type {IconDefinition}
   * @memberof MyStubudComponent
   */
  faUserCircle: IconDefinition = faUserCircle;

  /**
   * @description User icon
   *
   * @type {IconDefinition}
   * @memberof MyStubudComponent
   */
   faUser: IconDefinition = faUser;

  /**
   * @description Current logged in User
   *
   * @type {boolean}
   * @memberof SidebarComponent
   */
  @Input() user: User;

  public sideLeft: string = "-250px";
  public subCategorySideLeft: string = "-250px";

  /**
   * @description Is side nav opened - Main Ctg
   *
   * @type {boolean}
   * @memberof SidebarComponent
   */
  public isNavOpened: boolean = false;

  /**
   * @description Is Sub Ctg nav opened
   *
   * @type {boolean}
   * @memberof SidebarComponent
   */
  public isSubCategoryNavOpened: boolean = false;

  /**
   * @description Curr parent category name
   *
   * @type {string}
   * @memberof SidebarComponent
   */
  public selectedCtgNm: string;

  /**
   * @description All Categories - Main and Sub
   *
   * @type {{ category: string; subCategory: { name: string; }[]; }[]}
   * @memberof SidebarComponent
   */
  public categories: { category: string; subCategory: { name: string; }[]; }[];

  /**
   * @description Array of main Ctg names
   *
   * @type {string[]}
   * @memberof SidebarComponent
   */
  public mainCtgNmArr: string[] = [];

  /**
   * @description Array of sub ctg names - set per selected main ctg
   *
   * @type {{ name: string; }[]}
   * @memberof SidebarComponent
   */
  public subCategoryList: { name: string; }[];

  constructor(public authService: AuthService,
    private filterService: FilterService) {
  }

  ngOnInit(): void {
    this.faHome = faHome;
    this.faCog = faCog;
    this.faUserCircle = faUserCircle;
    this.categories = Constants.categories;
    this.setCtgNms();
  }

  /**
   * @description Open main side nav
   *
   * @memberof SidebarComponent
   */
  public showMainNav(): void {
    this.isNavOpened = true;
    this.sideLeft = "0px";
  }

  /**
   * @description Close main side nav
   *
   * @memberof SidebarComponent
   */
  public hideMainNav(): void {
    this.isNavOpened = false;
    this.sideLeft = "-250px";
  }

  /**
   * @description Close main side nav and sub ctg side nav
   *
   * @memberof SidebarComponent
   */
  public closeAllNav(): void {

    this.isSubCategoryNavOpened = false;
    this.subCategorySideLeft = "-250px";

    this.isNavOpened = false;
    this.sideLeft = "-250px";
  }

  /**
   * @description Open sub Ctg side Nav
   *
   * @private
   * @memberof SidebarComponent
   */
  private openSubCtgNav(): void {
    this.isSubCategoryNavOpened = true;
    this.subCategorySideLeft = "0px";
  }

  /**
   * @description Close sub Ctg side Nav
   *
   * @private
   * @memberof SidebarComponent
   */
  private closeSubCtgNav(): void {
    this.isSubCategoryNavOpened = false;
    this.subCategorySideLeft = "-250px";
  }

  /**
   * @description Show on browser sub ctg side nav
   *
   * @param {string} mainCtg
   * @returns {void}
   * @memberof SidebarComponent
   */
  public showSelectedSubCtg(mainCtg: string): void {
    if (mainCtg === Constants.defFilterCtg) {
      this.filterService.navigateWithCategory(Constants.defFilterCtg);
      this.hideMainNav();
      return;
    }
    this.selectedCtgNm = mainCtg;
    this.hideMainNav();
    this.openSubCtgNav();
    this.categories.map((x: { category: string; subCategory: { name: string; }[]; }): void => {
      if (x.category === mainCtg) {
        this.subCategoryList = x.subCategory;
      }
    });
  }

  /**
   * @description Hide sub ctg and show main nav
   *
   * @memberof SidebarComponent
   */
  public hideSubCtg(): void {
    this.closeSubCtgNav();
    this.showMainNav();
  }

  /**
   * @description Logout user
   *
   * @memberof SidebarComponent
   */
  public logout(): void {
    this.disableDropdown();
    this.authService.signOut().then((): void => {
        location.reload();
      }).catch((error: any): void => {
        console.error("Logout error", error);
      });
  }

  /**
   * @description Filter for Main Ctg names and push in Array
   *
   * @private
   * @memberof SidebarComponent
   */
  private setCtgNms(): void {
    this.categories.map((x: {category: string; subCategory: {name: string; }[]; }): void => {
      this.mainCtgNmArr.push(x.category);
    });
  }

  /**
   * @description On sub ctg clicked navigate with filter and close all nav
   *
   * @param {string} selectedCtg
   * @memberof SidebarComponent
   */
  public navigateToCtg(selectedCtg: string): void {
    this.filterService.navigateWithCategory(selectedCtg);
    this.disableDropdown();
  }

  /**
   * @description Close all main and sub nav
   *
   * @memberof SidebarComponent
   */
  public disableDropdown(): void {
    this.closeSubCtgNav();
    this.hideMainNav();
  }
}
