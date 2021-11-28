import { NgModule, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FAQsRoutingModule } from "./faqs-routing.module";
import { Optional } from "@angular/core";
import { FAQsComponent } from "../../components/faqs/faqs.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FaqsService } from "src/app/services/faqs.service";


@NgModule({
  declarations: [
    FAQsComponent
  ],
  imports: [
    CommonModule,
    FAQsRoutingModule,
    SharedModule
  ],
  providers: [FaqsService]
})
export class FAQsModule {
  /**
   * TODO To be removed on Prod after testing for no condition check there.
   * @description Creates an instance of FAQsModule.
   * @param {FAQsModule} parentModule
   * @memberof FAQsModule
   * @summary To make sure FAQsModule will not be imported multiple times, we can create a guard for this module.
   * @tutorial https://books.google.mu/books?id=xdyZDwAAQBAJ&printsec=frontcover#v=onepage&q&f=false
   */
  constructor(@Optional() @SkipSelf() parentModule: FAQsModule) {
    if (parentModule) {
      throw new Error("FAQsModule has already been loaded. Import user modules in the AppModule only.");
    }
  }
}
