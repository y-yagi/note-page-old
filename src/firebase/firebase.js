import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();

    this.fieldValue = app.firestore.FieldValue;
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
  doSignOut = () => this.auth.signOut();

  page = uid => this.db.doc(`pages/${uid}`);
  pages = () => this.db.collection('pages');
}

export default Firebase;
