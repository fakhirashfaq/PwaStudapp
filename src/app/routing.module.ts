import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { Constants } from "./shared/utils/constants";
import { UserGuard } from "./services/user.guard";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

// The routes array of Routes describes how to navigate.
/* Routes is an array of route configurations. Each one has the following properties (not all was listed):
 - path is a string that uses the route matcher DSL.
 - component: Component to route to.
 - canActivate: Route guard deciding if a route can be activated / navigated to
 - data: Additional data provided to the component via ActivatedRoute.
 Data is a place to store arbitrary data associated with this specific route.
 The data property is accessible within each activated route.
 Use it to store items such as page titles, breadcrumb text, and other read-only, static data
 - resolve: Pre-fetch the necessary data for a component or to do other checks prior loading a component.

 The Routes datatype is not compulsory and a plain const array would still work.
 Meanwhile declaring the array as Routes provide intellisense features.
*/
const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent, // Add 3rd params for Online or Offline
    // data: {
    //   title:
    //     Constants.homePageTitle + Constants.delimiter + Constants.businessName,
    // },
  },
  {
    path: "discount/:id",
    loadChildren: (): any => import("./modules/discount/discount.module").then(m => m.DiscountModule)
  },
  {
    // In Angular 8, dynamic import syntax was introduced for lazy-loaded routes as one of the new features instead of a custom string.
    path: "auth",
    loadChildren: (): any => import("./core/core.module").then((m) => m.CoreModule)
  },
  {
    // In Angular 8, dynamic import syntax was introduced for lazy-loaded routes as one of the new features instead of a custom string.
    path: "user",
    loadChildren: (): any =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    canActivate: [UserGuard],
  },
  {
    // In Angular 8, dynamic import syntax was introduced for lazy-loaded routes as one of the new features instead of a custom string.
    path: "favorites",
    loadChildren: (): any => import("./modules/favorites/favorites.module").then((m) => m.FavoritesModule),
    canActivate: [UserGuard],
  },
  {
    // In Angular 8, dynamic import syntax was introduced for lazy-loaded routes as one of the new features instead of a custom string.
    path: "FAQs",
    loadChildren: (): any => import("./modules/faqs/faqs.module").then((m) => m.FAQsModule),
  },
  { path: "", redirectTo: Constants.defaultUrl, pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }, // Crisis Page
  { path: "404", component: PageNotFoundComponent }
];

// Decorator that marks a class as an NgModule and supplies configuration metadata.
@NgModule({
  imports: [
    CommonModule, // Contributes many common directives such as ngIf and ngFor.
    RouterModule.forRoot(APP_ROUTES, { scrollPositionRestoration: "enabled" }), // Import the Routes configurations into the app
  ],
  exports: [RouterModule],
  declarations: [],
})
export class RoutingModule { }
