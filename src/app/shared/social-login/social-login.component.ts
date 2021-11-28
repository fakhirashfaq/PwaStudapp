import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Constants } from "src/app/shared/utils/constants";
import { AuthService } from "src/app/core/auth.service";
import { Helper } from "../utils/helper";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-social-login",
  templateUrl: "./social-login.component.html",
  styleUrls: ["./social-login.component.css"]
})
export class SocialLoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
  }

  /**
   * @description Log in user via Facebook and redirect user
   * @function
   * @member tryFacebookLogin
   * @memberof SocialLoginComponent
   */
  public tryFacebookLogin(): void {
    this.loadingBar.start();
    this.authService.facebookLogin()
      .then((): void => {
        this.router.navigate([Constants.routePage_Register]);
      })
      .catch((error: any): void => {
        console.error("Error signing in with Facebook", error);
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

  /**
   * @description Log in user via Google and redirect user
   *
   * @function
   * @member tryGoogleLogin
   * @memberof SocialLoginComponent
   */
  public tryGoogleLogin(): void {
    this.loadingBar.start();
    this.authService.googleLogin()
      .then((): void => {
        this.router.navigate([Constants.routePage_Register]);
      }).catch((error: any): void => {
        console.error("Error signing in with Google", error);
      }).finally((): void => {
        this.loadingBar.complete();
      });
  }

}
