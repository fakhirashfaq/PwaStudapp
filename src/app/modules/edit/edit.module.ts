import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EditRoutingModule } from "./edit-routing.module";
import { SkipSelf } from "@angular/core";
import { Optional } from "@angular/core";
import { EditUserDetailsComponent } from "../../components/edit-user-details/edit-user-details.component";
import { EditComponent } from "../../components/edit/edit.component";
import { SharedModule } from "src/app/shared/shared.module";
import { EditUserInstitutionComponent } from "../../components/edit-user-institution/edit-user-institution.component";
import { EditUserInsEmailComponent } from "../../components/edit-user-ins-email/edit-user-ins-email.component";
import { UploadProfPicComponent } from "../../components/upload-prof-pic/upload-prof-pic.component";
import { ImageCropperModule } from "ngx-image-cropper";


@NgModule({
  declarations: [
    EditUserDetailsComponent,
    EditUserInstitutionComponent,
    EditComponent,
    EditUserInsEmailComponent,
    UploadProfPicComponent
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    SharedModule,
    ImageCropperModule
  ]
})
export class EditModule {

  /**
   * TODO To be removed on Prod after testing for no condition check there.
   * @description Creates an instance of EditModule.
   * @param {EditModule} parentModule
   * @memberof EditModule
   * @summary To make sure EditModule will not be imported multiple times, we can create a guard for this module.
   * @tutorial https://books.google.mu/books?id=xdyZDwAAQBAJ&printsec=frontcover#v=onepage&q&f=false
   */
   constructor(@Optional() @SkipSelf() parentModule: EditModule) {
    if (parentModule) {
      throw new Error ("EditModule has already been loaded. Import user modules in the AppModule only.");
    }
  }

}
