import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditUserDetailsComponent } from "src/app/components/edit-user-details/edit-user-details.component";
import { EditComponent } from "src/app/components/edit/edit.component";
import { Constants } from "src/app/shared/utils/constants";
import { EditUserInstitutionComponent } from "src/app/components/edit-user-institution/edit-user-institution.component";
import { EditUserInsEmailComponent } from "src/app/components/edit-user-ins-email/edit-user-ins-email.component";
import { UploadProfPicComponent } from "src/app/components/upload-prof-pic/upload-prof-pic.component";

const routes: Routes = [
  {

    path: "",
    component: EditComponent,
    // data: {
    //   title:
    //     Constants.registerPageTitle +
    //     Constants.delimiter +
    //     Constants.businessName
    // },
    canActivate: [],
    children: [
      {
        path: "edit-your-details", // child route path
        component: EditUserDetailsComponent, // child route component that the router renders
        canActivate: []
      },
      {
        path: "edit-your-institution", // child route path
        component: EditUserInstitutionComponent, // child route component that the router renders
        canActivate: []
      },
      {
        path: "edit-ins-email", // child route path
        component: EditUserInsEmailComponent, // child route component that the router renders
        canActivate: []
      },
      {
        path: "upload-profile-pic", // child route path
        component: UploadProfPicComponent, // child route component that the router renders
        canActivate: []
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
