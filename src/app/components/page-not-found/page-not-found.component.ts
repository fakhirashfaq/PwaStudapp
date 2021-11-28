import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.css"]
})
export class PageNotFoundComponent implements OnInit {

  public worriedEmj: string;

  constructor(private router: Router) {
    this.worriedEmj = "&#128543;"; 
  }

  ngOnInit(): void {
  }

  public goToHomePage(): void {
    this.router.navigate([Constants.empty]);
  }

}
