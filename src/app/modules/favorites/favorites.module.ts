import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FavoritesRoutingModule } from "./favorites-routing.module";
import { SkipSelf, Optional } from "@angular/core";
import { FavoritesComponent } from "../../components/favorites/favorites.component";
import { HeaderModule } from "../header/header.module";
import { FooterModule } from "../footer/footer.module";
import { SharedModule } from "src/app/shared/shared.module";
import { LayoutModule } from "../layout/layout.module";



@NgModule({
  declarations: [FavoritesComponent],
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    HeaderModule,
    FooterModule,
    SharedModule,
    LayoutModule
  ]
})
export class FavoritesModule {
  constructor(@Optional() @SkipSelf() parentModule: FavoritesModule) {
    if (parentModule) {
      throw new Error ("FavoritesModule has already been loaded. Import Core modules in the AppModule only.");
    }
  }
}
