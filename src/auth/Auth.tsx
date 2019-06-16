import history from "../history";
import Firebase from "../firebase/firebase";

export default class Auth {
  firebase = new Firebase();

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.firebase.auth.signInWithRedirect(this.firebase.googleProvider);
  }

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

  userID() {
    return localStorage.getItem("user_id");
  }
}
