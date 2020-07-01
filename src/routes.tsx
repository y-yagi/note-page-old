import React, { StrictMode } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import App from "./components/App";
import NoteBookForm from "./components/NoteBookForm";
import Login from "./components/Login";
import Auth from "./libs/Auth";
import PageRepository from "./libs/PageRepository";
import history from "./history";
import { History } from "history";
import { initFirebase } from "./libs/firebase";
import NoteBookRepository from "./libs/NoteBookRepository";

const app = initFirebase();
const auth = new Auth(app);
const pageRepositrory = new PageRepository(app);
const noteBookRepository = new NoteBookRepository(app);

const PrivateRoute = ({
  component: Component,
  auth,
  path,
  pageRepository,
  noteBookRepository,
  history,
}: {
  component: Function;
  auth: Auth;
  path: string;
  pageRepository: PageRepository;
  noteBookRepository: NoteBookRepository;
  history: History;
}) => (
  <Route
    path={path}
    render={(props) =>
      auth.isAuthenticated() ? (
        <div>
          <Component
            auth={auth}
            pageRepository={pageRepository}
            noteBookRepository={noteBookRepository}
            history={history}
            {...props}
          />
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
              render={(props) => <Login auth={auth} {...props} />}
            />
            <PrivateRoute
              component={NoteBookForm}
              auth={auth}
              path="/notebooks/new"
              history={history}
              pageRepository={pageRepositrory}
              noteBookRepository={noteBookRepository}
            />
            <PrivateRoute
              component={App}
              auth={auth}
              path="/"
              history={history}
              pageRepository={pageRepositrory}
              noteBookRepository={noteBookRepository}
            />
          </Switch>
        </div>
      </Router>
    </StrictMode>
  );
};
