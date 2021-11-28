import { DocumentReference } from "@angular/fire/compat/firestore";
import { Point } from "./point";

export interface Buddy {
  id: string;
  name: string;
  imgUrl: string;
  ctg_ref: DocumentReference;
  details: string;
  isOnline: boolean;
  points: Point[];
  url: string;
}
