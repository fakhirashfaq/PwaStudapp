import FirebaseFirestore from "@firebase/firestore-types";

export interface Point {
  geohash: string;
  geopoint: FirebaseFirestore.GeoPoint;
  address: string;
  isDiscountProvided: boolean;
}
