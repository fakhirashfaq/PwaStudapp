import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth.service";
import { User } from "src/app/models/user";
import { take } from "rxjs/operators";
import { Constants } from "../utils/constants";
import { IconDefinition, faUser } from "@fortawesome/free-solid-svg-icons";
import { ModalService } from "src/app/services/modal.service";
import { ConvertUserComponent } from "src/app/components/convert-user/convert-user.component";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit {


  faUser: IconDefinition = faUser;

  public user: User;

  public searchForm: FormGroup;

  constructor(public authService: AuthService,
    private route: Router,
    private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One)).subscribe((user: User): void => {
      if (user != null) {
        this.user = user;
      }

    });
  }

  // goToPage(pageURL: string): void {
  //   this.route.navigate([pageURL]);
  // }

  goToPageIfAuthorized(pageURL: string): void {
    if (!!this.user) {
      this.route.navigate([pageURL]);
    } else {
      this.modalService.init(ConvertUserComponent, {}, {});
    }
  }

  /**
   * @description Sign out the current user
   * @function
   * @member signOut
   * @memberof HeaderComponent
   */
  public signOut(): void {
    this.authService.signOut()
      .then((): void => {
        location.reload();
      }).catch((error: any): void => {
        console.log(error);
      });
  }

}
