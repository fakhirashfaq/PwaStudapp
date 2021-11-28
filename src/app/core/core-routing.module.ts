import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { Constants } from "../shared/utils/constants";
import { AuthGuard } from "./auth.guard";
import { RegisterComponent } from "../components/register/register.component";
import { CreateAccountComponent } from "../components/create-account/create-account.component";
import { UserDetailsComponent } from "../components/user-details/user-details.component";
import { UserInstitutionComponent } from "../components/user-institution/user-institution.component";
import { VerifyInstitutionComponent } from "../components/verify-institution/verify-institution.component";
import { ChangePasswordComponent } from "../components/change-password/change-password.component";
import { ResetPasswordComponent } from "../components/reset-password/reset-password.component";

const CORE_ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    // data: {
    //   title:
    //     Constants.loginPageTitle + Constants.delimiter + Constants.businessName
    // }
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [],
    // data: {
    //   title:
    //     Constants.changePassPageTitle + Constants.delimiter + Constants.businessName
    // }
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [],
    // data: {
    //   title:
    //     Constants.resetPassPageTitle + Constants.delimiter + Constants.businessName
    // }
  },
  {

    path: "register",
    component: RegisterComponent,
    // data: {
    //   title:
    //     Constants.registerPageTitle +
    //     Constants.delimiter +
    //     Constants.businessName
    // },
    canActivate: [AuthGuard],
    children: [
      {
        path: "", pathMatch: "full",
        canActivate: [AuthGuard]
      },
      {
        path: "create-account", // child route path
        component: CreateAccountComponent, // child route component that the router renders
        canActivate: [AuthGuard]
      },
      {
        path: "your-details", // child route path
        component: UserDetailsComponent, // child route component that the router renders
        canActivate: [AuthGuard]
      },
      {
        path: "your-institution", // child route path
        component: UserInstitutionComponent, // child route component that the router renders
        canActivate: [AuthGuard]
      },
      {
        path: "verify-institution", // child route path
        component: VerifyInstitutionComponent, // child route component that the router renders
        canActivate: [AuthGuard]
      }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(CORE_ROUTES) // We always use forChild() for other modules as the forRoot() function is reserved for the app's root module.
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
