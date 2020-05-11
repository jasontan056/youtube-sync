import * as firebase from "firebase/app";
import {firebaseKeys} from "./Keys";
import "firebase/database";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseKeys);
}

export default firebase;
