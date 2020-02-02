import firebase from "firebase";
import "firebase/auth";
import App from "firebase/app";
import history from "../history";

export default class Auth {
  app: firebase.app.App;

  constructor(app: firebase.app.App) {
    this.app = app;

    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  doSignOut = () => this.app.auth().signOut();
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

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.app.auth().signInWithRedirect(provider);
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
    return this.app.auth().getRedirectResult();
  }
}
