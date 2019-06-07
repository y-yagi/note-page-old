import React, { StrictMode } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import App from "./components/App";
import Login from "./components/Login";
import Auth from "./auth/Auth";
import history from "./history";

const auth = new Auth();

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated() ? (
        <div>
          <Component auth={auth} {...props} />
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
              render={props => <Login auth={auth} {...props} />}
            />
            <PrivateRoute extract path="/" component={App} auth={auth} />
          </Switch>
        </div>
      </Router>
    </StrictMode>
  );
};
