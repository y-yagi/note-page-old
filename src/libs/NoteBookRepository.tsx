import * as firebase from "firebase/app";
import "firebase/firestore";

export default class NoteBookRepository {
  db: firebase.firestore.Firestore;
  app: firebase.app.App;

  constructor(app: firebase.app.App) {
    this.app = app;
    this.db = this.app.firestore();
  }

  notebook = (uid: string) => this.db.doc(`notebooks/${uid}`);
  notebooks = () => this.db.collection("notebooks");
  timestamp = () => firebase.firestore.FieldValue.serverTimestamp();
}
