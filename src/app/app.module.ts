import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // TODO CHeck if used
import { RoutingModule } from "./routing.module";

import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

import { HomeComponent } from "./components/home/home.component";

import { AuthGuard } from "./core/auth.guard";
import { AngularFireModule } from "@angular/fire/compat"; // AngularFire is the official library that connects Angular to Firebase. It's a modular package to support different Firebase features
import { AngularFireAuthModule } from "@angular/fire/compat/auth"; // AngularFire's module for Authentication
import { AngularFireStorageModule } from "@angular/fire/compat/storage"; // AngularFire's module for Firebase Cloud Storage.

import { AgmCoreModule } from "@agm/core";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

import { SharedModule } from "./shared/shared.module";
import { HeaderModule } from "./modules/header/header.module";
import { LayoutModule } from "./modules/layout/layout.module";
import { ConvertUserComponent } from "./components/convert-user/convert-user.component"; // TODO Check if need to move to layout module
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { FooterModule } from "./modules/footer/footer.module";

import { NgpCarouselModule } from "@kinect-pro/ngp-carousel"; // https://prettyangular.kinect.pro/components/carousel

import { LoadingBarModule } from "@ngx-loading-bar/core";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { NgcCookieConsentConfig, NgcCookieConsentModule } from "ngx-cookieconsent"; // Cookie Consent module for Angular. More at https://tinesoft.github.io/ngx-cookieconsent/home

const cookieConfig: NgcCookieConsentConfig = { // TODO Follow laws and re-adapt config with https://tinesoft.github.io/ngx-cookieconsent/home.
  cookie: {
    domain: environment.cookieConfig.domain // or 'your.domain.com'
  },
  position: "bottom",
  theme: "edgeless",
  palette: {
    popup: {
      background: "#000000",
      text: "#ffffff",
      link: "#ffffff"
    },
    button: {
      background: "#04a3ff",
      text: "#ffffff",
      border: "transparent"
    }
  },
  type: "info",
  content: {
    message: "This website uses cookies to ensure you get the best experience on our website.",
    dismiss: "Got it!",
    deny: "Refuse cookies",
    link: "Learn more",
    href: "https://cookiesandyou.com",
    policy: "Cookie Policy"
  }
};


// Decorator that marks a class as an NgModule and supplies configuration metadata.
@NgModule({
  // All components created in this project
  declarations: [
    AppComponent, // Root component
    HomeComponent,
    PageNotFoundComponent
  ],

  /* External Modules required and used in this project. */
  imports: [
    BrowserModule, // The browser module is the “ng module for the browser” according to Angular’s documentation. It’s essentially the middleman between the browser and our app.
    BrowserAnimationsModule,
    RoutingModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleMapsApiKey /* My Google Maps API key */ }), // The angular-google-maps core module
    AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
    AngularFireStorageModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }), // ServiceWorkerModule for registering ngsw-config.js (only for production mode)
    AngularFirestoreModule,
    AngularFireAuthModule,
    SharedModule, // Add Shared module,
    HeaderModule,
    LayoutModule,
    FooterModule,
    NgpCarouselModule,
    LoadingBarModule, // Core module to manage the progress bar manually.
    LoadingBarRouterModule, // For displaying loading bar when navigating between routes.
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  /*
   * Dependencies whose providers are listed here become available for injection into any component,
   * directive, pipe or service that is a child of this injector. This is not the recommended way since the following services
   * will be end up in the final bundle even if it is not used in the application.
   */
  providers: [
    // AuthService, // { provide: AuthService, useClass: AuthService }
    // UserService, // { provide: UserService, useClass: UserService }
    AuthGuard // { provide: AuthGuard, useClass: AuthGuard }
  ],
  /*
   * The entryComponents is used to define the components that are not found in html initially
   * and that are created dynamically with ComponentFactoryResolver.
   * If a component isn't an entry component and isn't found in a template, the tree shaker will throw it away.
   * So, it's best to add only the components that are truly entry components to help keep your app as trim as possible.
   */
  entryComponents: [
    ConvertUserComponent // Since ConvertUserComponent will be dynamically added to the DOM, we need to mention it in the NgModule decorator.
  ],
  // The root component that Angular creates and inserts into the index.html host web page at startup.
  // Bootstrapping begins with the main.ts file. This is specified in the angular.json file under the "main" tag.
  bootstrap: [AppComponent] // bootstrapped entry component / Root component
})
export class AppModule { }
