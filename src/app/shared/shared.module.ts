import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StubudButtonComponent } from "./stubud-button/stubud-button.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { PageLoadingComponent } from "../components/pageLoading/pageLoading.component";
import { LikeUnlikeComponent } from "./like-unlike/like-unlike.component"; // Import statements now case sensitive in production / aot only


@NgModule({
  declarations: [
    StubudButtonComponent,
    PageLoadingComponent,
    LikeUnlikeComponent
  ],
  imports: [
    CommonModule,  // Contributes many common directives such as ngIf and ngFor.
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    StubudButtonComponent,
    RouterModule,
    PageLoadingComponent,
    LikeUnlikeComponent
  ]
})
export class SharedModule { }
