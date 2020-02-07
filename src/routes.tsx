import React, { StrictMode } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import App from "./components/App";
import Login from "./components/Login";
import Auth from "./libs/Auth";
import PageRepository from "./libs/PageRepository";
import history from "./history";
import { initFirebase } from "./libs/firebase";

const app = initFirebase();
const auth = new Auth(app);
const pageRepositrory = new PageRepository(app);

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated() ? (
        <div>
          <Component auth={auth} pageRepository={pageRepositrory} {...props} />
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
            <PrivateRoute
              extract
              path="/"
              component={App}
              auth={auth}
              pageRepository={pageRepositrory}
            />
          </Switch>
        </div>
      </Router>
    </StrictMode>
  );
};
