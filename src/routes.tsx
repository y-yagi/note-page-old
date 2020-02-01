import React, { StrictMode } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import App from "./components/App";
import Login from "./components/Login";
import Auth from "./auth/Auth";
import Firebase from "./firebase/firebase";
import history from "./history";

const auth = new Auth();
const firebase = new Firebase();

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated() ? (
        <div>
          <Component auth={auth} firebase={firebase} {...props} />
        </div>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export const makeMainRoutes = () => {
  return (
    <StrictMode>
      <Router history={history}>
        <div>
          <Switch>
            <Route
              path="/login"
              render={props => (
                <Login auth={auth} firebase={firebase} {...props} />
              )}
            />
            <PrivateRoute
              extract
              path="/"
              component={App}
              auth={auth}
              firebase={firebase}
            />
          </Switch>
        </div>
      </Router>
    </StrictMode>
  );
};
