import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.css"]
})
export class ProgressComponent implements OnInit {

  /**
   * @description Progress value
   *
   * @type {number}
   * @memberof ProgressComponent
   */
  @Input() progress: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
