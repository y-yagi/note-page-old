import app from "firebase/app";
import "firebase/auth";
import history from "../history";

export default class Auth {
  googleProvider: firebase.auth.GoogleAuthProvider;

  constructor() {
    this.googleProvider = new app.auth.GoogleAuthProvider();

    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login = () => app.auth().signInWithRedirect(this.googleProvider);
  doSignInWithGoogle = () => app.auth().signInWithPopup(this.googleProvider);
  doSignOut = () => app.auth().signOut();
  userID = () => localStorage.getItem("user_id");

  handleAuthentication(authResult) {
    // 7 days
    let expiresAt = JSON.stringify(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 7
    );
    localStorage.setItem("user_id", authResult.user.uid);
    localStorage.setItem("expires_at", expiresAt);
    history.replace("/");
  }

  logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("expires_at");
    history.replace("/login");
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  getRedirectResult() {
    return this.auth.getRedirectResult();
  }
}
