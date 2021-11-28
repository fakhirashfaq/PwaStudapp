// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
  production: false,

  // Your web app's Firebase configuration which connects the angular app with the Firebase app
  firebaseConfig: {
    /// ***Partner API Information****/
    apiKey: "AIzaSyCs4ecYJrXNct29uVIm3IpbQ3bVJbx6BZQ",
    authDomain: "stubud-bb83b.firebaseapp.com",
    databaseURL: "https://stubud-bb83b.firebaseio.com",
    projectId: "stubud-bb83b",
    storageBucket: "stubud-bb83b.appspot.com",
    // messagingSenderId: "740540663851",
    // appId: "1:740540663851:web:b4ab86cc4171774d"
  },
  googleMapsApiKey: "AIzaSyAaq2Xzb36PGUMn3ZxwJvCaqtnrTj_FrgQ",
  algolia: {
    appId: "OVK7JHZ9B4",
    apiKey: "7652c6470317879c804269d5bd9138d9"
  },
  reCaptcha: {
    siteKey: "6LdAeLEZAAAAAHER-DTQfQrDLlCrftjB_DaHBOjZ"
  },
  ci: {
    token: "1//03iT5d5w07YnPCgYIARAAGAMSNwF-L9Ir1kVPKLp0VQaGzhOoGPaW68WmKR4ZYnSxbWQiIipylWavgoEnuBNQQEWM0JAY5gbZPyY"
  },
  cookieConfig: {
    domain: "localhost" // or 'your.domain.com'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
