import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { MyStubudComponent } from "src/app/components/my-stubud/my-stubud.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HeaderModule } from "../header/header.module";
import { UserProfileComponent } from "../../components/user-profile/user-profile.component";
import { DiscountCardComponent } from "../../components/discount-card/discount-card.component";
import { ExpiryDatePipe } from "../../pipes/expiry-date.pipe";
import { FooterModule } from "../footer/footer.module";
import { UserAccountComponent } from "../../components/user-account/user-account.component";
import { ConfirmDeleteAccountComponent } from "../../components/confirm-delete-account/confirm-delete-account.component";


@NgModule({
  declarations: [
    MyStubudComponent,
    UserProfileComponent,
    DiscountCardComponent,
    ExpiryDatePipe,
    UserAccountComponent,
    ConfirmDeleteAccountComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    HeaderModule,
    FooterModule
  ],
  exports: [
    MyStubudComponent,
    UserProfileComponent
  ]
})
export class UserModule {

  /**
   * TODO To be removed on Prod after testing for no condition check there.
   * @description Creates an instance of UserModule.
   * @param {UserModule} parentModule
   * @memberof UserModule
   * @summary To make sure UserModule will not be imported multiple times, we can create a guard for this module.
   * @tutorial https://books.google.mu/books?id=xdyZDwAAQBAJ&printsec=frontcover#v=onepage&q&f=false
   */
  constructor(@Optional() @SkipSelf() parentModule: UserModule) {
    if (parentModule) {
      throw new Error ("UserModule has already been loaded. Import user modules in the AppModule only.");
    }
  }
}
