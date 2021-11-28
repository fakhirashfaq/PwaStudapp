import { Component, OnInit } from "@angular/core";
import { Constants } from "../utils/constants";

@Component({
  selector: "app-terms-and-conditions",
  templateUrl: "./terms-and-conditions.component.html",
  styleUrls: ["./terms-and-conditions.component.css"]
})
export class TermsAndConditionsComponent implements OnInit {

  /**
   * @description Is TermsAndConditionsComponent component collapsed
   * @type {boolean}
   * @member isCollapsed
   * @memberof TermsAndConditionsComponent
   */
  public isCollapsed: boolean;

  /**
   * @description Text to display.
   * @summary Either Read More or Show less
   * @type {string}
   * @member text
   * @memberof TermsAndConditionsComponent
   */
  public text: string;

  constructor() {
    this.isCollapsed = true;
    this.text = Constants.showTAndC;
  }

  ngOnInit(): void {
  }

  /**
   * @description Switch collapse state and change to corresponding text
   * @member switchCollapse
   * @memberof TermsAndConditionsComponent
   */
  public switchCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.text = this.isCollapsed ? Constants.showTAndC : Constants.hideTAndC;
  }

}
