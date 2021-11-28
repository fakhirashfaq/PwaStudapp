/*
The main entry point for your app.
Only angular-cli.json references it for handling the startup of the application.
Compiles the application with the JIT (just-in-time) compiler and,
bootstraps the application's root module (AppModule) to run in the browser.

The Angular just-in-time (JIT) compiler converts your Angular HTML and
TypeScript code into efficient JavaScript code at run time, as part of bootstrapping
 */

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

// Environment Variables in Angular
if (environment.production) {
  // Disable Angular's development mode, which turns off assertions and other checks within the framework.
  enableProdMode();
}

// Bootstrap the AppModule which in turn bootstrap the AppComponent
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

