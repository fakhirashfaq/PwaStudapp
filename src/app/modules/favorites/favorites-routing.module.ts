import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FavoritesComponent } from "src/app/components/favorites/favorites.component";
import { Constants } from "src/app/shared/utils/constants";

const FAVORITES_ROUTES: Routes = [
  {
    path: "",
    component: FavoritesComponent,
    // data: {
    //   title:
    //     Constants.loginPageTitle + Constants.delimiter + Constants.businessName
    // }
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(FAVORITES_ROUTES) // We always use forChild() for other modules as the forRoot() function is reserved for the app's root module.
  ],
  exports: [RouterModule]
})
export class FavoritesRoutingModule { }
