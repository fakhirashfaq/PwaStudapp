import { Injectable } from "@angular/core";
import { GeoPoint } from "@angular/fire/firestore";


@Injectable({
  providedIn: "root" // We declare that this service should be created by the root application injector.
})
export class DistanceService {

  constructor() {
  }

  // getDistanceFromLatLonInKm(lat1, lon1, position) {
  //   const R = 6371; // Radius of the earth in km
  //   let dLat, dLon, a, c, d;
  //   lat1 = parseFloat(lat1);
  //   lon1 = parseFloat(lon1);
  //   dLat = this.deg2rad(position.coords.latitude - lat1);  // deg2rad below
  //   dLon = this.deg2rad(position.coords.longitude - lon1);
  //   a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(position.coords.latitude)) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   d = R * c; // Distance in km;
  //   console.log("Distance is : " + d);
  //   return d < 5;
  // }

  /**
   * @description Get current location of user
   *
   * @returns {Promise<FirebaseFirestore.GeoPoint>}
   * @memberof DistanceService
   */
  public getCurrentUserPos(): Promise<GeoPoint> {
    return new Promise((resolve: any): void => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any): void => {
          resolve(new GeoPoint(position.coords.latitude, position.coords.longitude));
        });
      } else {
        alert("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  }

  // deg2rad(deg) {
  //   return deg * (Math.PI / 180);
  // }
}
