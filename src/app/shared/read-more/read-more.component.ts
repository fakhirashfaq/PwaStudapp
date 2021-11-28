import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-read-more",
  templateUrl: "./read-more.component.html",
  styleUrls: ["./read-more.component.css"]
})
export class ReadMoreComponent implements OnInit {

  /**
   * @description Is read-more component collapsed
   * @type {boolean}
   * @member isCollapsed
   * @memberof ReadMoreComponent
   */
  public isCollapsed: boolean;

  /**
   * @description Text to display.
   * @summary Either Read More or Show less
   * @type {string}
   * @member text
   * @memberof ReadMoreComponent
   */
  public text: string;

  constructor() {
    this.isCollapsed = true;
    this.text = "Read More";
  }

  ngOnInit(): void {
  }

  /**
   * @description Switch collapse state and change to corresponding text
   * @member switchCollapse
   * @memberof ReadMoreComponent
   */
  public switchCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.text = this.isCollapsed ? "Read More" : "Show Less";
  }

}
