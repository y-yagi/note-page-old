import * as firebase from "firebase/app";
import "firebase/firestore";

export default class PageRepository {
  db: firebase.firestore.Firestore;
  app: firebase.app.App;

  constructor(app: firebase.app.App) {
    this.app = app;
    this.db = this.app.firestore();
  }

  page = (uid) => this.db.doc(`pages/${uid}`);
  pages = () => this.db.collection("pages");
  timestamp = () => firebase.firestore.FieldValue.serverTimestamp();
}
