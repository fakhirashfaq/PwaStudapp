import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DiscountItemComponent } from "../../components/discountitem/discountitem.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DiscountTypeFilterComponent } from "../../components/discount-type-filter/discount-type-filter.component";
import { ConvertUserComponent } from "src/app/components/convert-user/convert-user.component";
import { SortCategoryComponent } from "../../components/sort-category/sort-category.component";

@NgModule({
  declarations: [
    DiscountItemComponent,
    DiscountTypeFilterComponent,
    ConvertUserComponent,
    SortCategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DiscountItemComponent,
    DiscountTypeFilterComponent,
    SortCategoryComponent
  ],
})
export class LayoutModule {}
