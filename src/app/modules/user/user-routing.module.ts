import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyStubudComponent } from "src/app/components/my-stubud/my-stubud.component";


const routes: Routes = [
  {
    path: "", component: MyStubudComponent,
    children: [
    ],
  },
  { path: "edit", loadChildren: () => import("../edit/edit.module").then(m => m.EditModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // We always use forChild() for other modules as the forRoot() function is reserved for the app's root module.
  exports: [RouterModule]
})
export class UserRoutingModule { }
