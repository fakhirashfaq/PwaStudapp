import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-stubud-button",
  templateUrl: "./stubud-button.component.html",
  styleUrls: ["./stubud-button.component.css"]
})
export class StubudButtonComponent implements OnInit {

  /**
   * @description Extra css styles
   * @type {boolean}
   * @member expand
   * @memberof StubudButtonComponent
   */
  @Input() expand: boolean;

  /**
   * @description Button type. By default of type button
   * @type {string}
   * @memberof StubudButtonComponent
   */
  @Input() buttonType: string = "button";

  /**
   * @description Button style config
   *
   * @type {*}
   * @memberof StubudButtonComponent
   */
  public buttonStyleConfig: any;

  @Output() clickEvtEmitter: EventEmitter<void>;

  constructor() {
    this.clickEvtEmitter = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.setButtonStyles();
  }

  onClickButton(): void {
    this.clickEvtEmitter.emit();
  }

  private setButtonStyles(): void {
    if (this.expand) {
      this.buttonStyleConfig = {
        width: "100%"
      };
    }
  }

}
