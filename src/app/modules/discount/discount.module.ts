import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DiscountRoutingModule } from "./discount-routing.module";
import { DiscountComponent } from "src/app/components/discount/discount.component";
import { ReadMoreComponent } from "src/app/shared/read-more/read-more.component";
import { TermsAndConditionsComponent } from "src/app/shared/terms-and-conditions/terms-and-conditions.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HeaderModule } from "../header/header.module";
import { ShareModule } from "ngx-sharebuttons"; // https://ngx-sharebuttons.netlify.app/#/share-button-directive

@NgModule({
  declarations: [
    DiscountComponent,
    ReadMoreComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    SharedModule,
    HeaderModule,
    ShareModule
  ]
})
export class DiscountModule {

  /**
   * TODO To be removed on Prod after testing for no condition check there.
   * @description Creates an instance of DiscountModule.
   * @param {DiscountModule} parentModule
   * @memberof DiscountModule
   * @summary To make sure DiscountModule will not be imported multiple times, we can create a guard for this module.
   * @tutorial https://books.google.mu/books?id=xdyZDwAAQBAJ&printsec=frontcover#v=onepage&q&f=false
   */
   constructor(@Optional() @SkipSelf() parentModule: DiscountModule) {
    if (parentModule) {
      throw new Error ("DiscountModule has already been loaded. Import Discount modules in the AppModule only.");
    }
  }

}
