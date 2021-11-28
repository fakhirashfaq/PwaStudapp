import { NgModule } from "@angular/core";

import { HeaderComponent } from "../../shared/header/header.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { SearchComponent } from "../../shared/search/search.component";
import { SharedModule } from "../../shared/shared.module";
import { LayoutModule } from "../layout/layout.module";

import { NgAisModule } from "angular-instantsearch"; // Algolia Angular InstantSearchks

import { NavBarComponent } from "src/app/shared/nav-bar/nav-bar.component";

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SearchComponent,
    NavBarComponent,

  ],
  imports: [
    SharedModule,
    LayoutModule,
    NgAisModule.forRoot(), // Algolia
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
