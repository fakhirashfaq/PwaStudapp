import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: "app-pageLoading",
  templateUrl: "./pageLoading.component.html",
  styleUrls: ["./pageLoading.component.css"]
})
export class PageLoadingComponent implements OnInit {

  @Input() customVisibility; // customVisibility will be passed by another component (Several components)
  constructor() {
  }

  ngOnInit() {
  }

}
