import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/auth.service";
import { take } from "rxjs/operators";
import { Constants } from "src/app/shared/utils/constants";
import { User } from "src/app/models/user";
import { IconDefinition, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-my-stubud",
  templateUrl: "./my-stubud.component.html",
  styleUrls: ["./my-stubud.component.css"],
})
export class MyStubudComponent implements OnInit {

  public currUser: User;

  public faExclamationCircle: IconDefinition;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.faExclamationCircle = faExclamationCircle;
  }

  /**
   * @description Get current user from AuthService
   * @function
   * @private
   * @returns {Promise<boolean>}
   * @member getCurrentUser
   * @memberof DiscountComponent
   */
  private getCurrentUser(): void {
    this.authService.userAuthState$.pipe(take(Constants.numberValue_One))
      .subscribe((user: User): void => {
        this.currUser = user;
        console.log(this.currUser)
      });
  }

}
