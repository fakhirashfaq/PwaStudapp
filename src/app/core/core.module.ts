import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

import { LoginComponent } from "../components/login/login.component";
import { RegisterComponent } from "../components/register/register.component";
import { SocialLoginComponent } from "../shared/social-login/social-login.component";
import { SharedModule } from "../shared/shared.module";
import { CoreRoutingModule } from "./core-routing.module";
// import { InternationalPhoneNumberModule } from "ngx-international-phone-number";
import { NgxCaptchaModule } from "ngx-captcha";
import { CreateAccountComponent } from "../components/create-account/create-account.component";
import { UserDetailsComponent } from "../components/user-details/user-details.component";
import { UserInstitutionComponent } from "../components/user-institution/user-institution.component";
import { VerifyInstitutionComponent } from "../components/verify-institution/verify-institution.component";
import { DndDirective } from "../directives/dnd.directive";
import { ProgressComponent } from "../components/progress/progress.component";
import { DnDFUploaderComponent } from "../components/dn-d-f-uploader/dn-d-f-uploader.component";
import { UploadTaskComponent } from "../components/upload-task/upload-task.component";
import { ManualVerificationsComponent } from "../components/manual-verifications/manual-verifications.component";
import { AngularFireFunctionsModule } from "@angular/fire/compat/functions";
import { ChangePasswordComponent } from "../components/change-password/change-password.component";
import { ResetPasswordComponent } from "../components/reset-password/reset-password.component";



/**
 * @description Core Module
 *
 * @export
 * @class CoreModule
 * @summary Although technically optional, it is a good design pattern to keep your authentication setup in a core module.
 * The purpose of a core module is to provide services that your app will use globally,
 * such as authentication, logging, toast messages, etc.
 */
@NgModule({
  declarations: [
    SocialLoginComponent,
    LoginComponent,
    RegisterComponent,
    CreateAccountComponent,
    UserDetailsComponent,
    UserInstitutionComponent,
    VerifyInstitutionComponent,
    DndDirective,
    ProgressComponent,
    DnDFUploaderComponent,
    UploadTaskComponent,
    ManualVerificationsComponent,
    ChangePasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule, // Contributes many common directives such as ngIf and ngFor.
    AngularFireAuthModule, // FireAuthModule is needed for authentication features like monitoring authentication state, Log-in providers and security
    AngularFirestoreModule, // FirestoreModule is needed for the database features like working with collections, queries, and services for data streaming and manipulation
    SharedModule,
    CoreRoutingModule,
    // InternationalPhoneNumberModule, // InternationalPhoneNumberModule module
    NgxCaptchaModule, // https://www.npmjs.com/package/ngx-captcha,
    AngularFireFunctionsModule
  ],
  providers: [
    // AuthService,
    // CustomValidatorsService // { provide: CustomValidatorsService, useClass: CustomValidatorsService }
  ],
  exports: [
    SocialLoginComponent,
    LoginComponent,
    RegisterComponent,
    CreateAccountComponent,
    UserDetailsComponent,
    UserInstitutionComponent,
    VerifyInstitutionComponent,
    ProgressComponent,
    DnDFUploaderComponent
  ]
})
export class CoreModule {

  /**
   * TODO To be removed on Prod after testing for no condition check there.
   * @description Creates an instance of CoreModule.
   * @param {CoreModule} parentModule
   * @memberof CoreModule
   * @summary To make sure CoreModule will not be imported multiple times, we can create a guard for this module.
   * @tutorial https://books.google.mu/books?id=xdyZDwAAQBAJ&printsec=frontcover#v=onepage&q&f=false
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error ("CoreModule has already been loaded. Import Core modules in the AppModule only.");
    }
  }
}
