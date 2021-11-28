import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DiscountComponent } from "src/app/components/discount/discount.component";
import { DiscountResolverService } from "src/app/resolvers/discount-resolver.service";
import { Constants } from "src/app/shared/utils/constants";

const routes: Routes = [
  {
    path: "",
    component: DiscountComponent,
    // data: {
    //   title:
    //     Constants.discountDetailsPageTitle +
    //     Constants.delimiter +
    //     Constants.businessName
    // },
    resolve: { resolvedDiscountAndBuddy: DiscountResolverService },
    canActivate: [],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
