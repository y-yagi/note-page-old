import app from "firebase/app";
import "firebase/firestore";

export default class PageRepository {
  db: firebase.firestore.Firestore;

  constructor() {
    this.db = app.firestore();
  }

  page = uid => this.db.doc(`pages/${uid}`);
  pages = () => this.db.collection("pages");
  timestamp = () => app.firestore.FieldValue.serverTimestamp();
}
