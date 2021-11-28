import { Component, OnInit } from "@angular/core";
import { ModalService } from "src/app/services/modal.service";
import { Router } from "@angular/router";
import { faUser, IconDefinition } from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: "app-convert-user",
  templateUrl: "./convert-user.component.html",
  styleUrls: ["./convert-user.component.css"]
})
export class ConvertUserComponent implements OnInit {

  faUser: IconDefinition;

  constructor(private modalService: ModalService, private router: Router) { }

  ngOnInit(): void {
    this.faUser = faUser;
  }

  /**
   * @description Close component
   * @function
   * @member
   * @memberof ConvertUserComponent
   */
  public close(): void {
    this.modalService.destroy();
  }

  goToPage(pageURL: string): void {
    this.close();
    this.router.navigate([pageURL]);
  }

}
