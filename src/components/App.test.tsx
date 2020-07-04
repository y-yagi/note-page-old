import React from "react";
import ReactDOM from "react-dom";
import history from "../history";
import App from "./App";
import * as firebase from "@firebase/testing";
import Auth from "../libs/Auth";
import PageRepository from "../libs/PageRepository";
import NoteBookRepository from "../libs/NoteBookRepository";
import { act, render, fireEvent } from "@testing-library/react";

const FIRESTORE_PROJECT_ID = "my-test-project";
const app = firebase.initializeTestApp({
  projectId: FIRESTORE_PROJECT_ID,
  auth: { uid: "alice", email: "alice@example.com" },
});

afterEach(() => {
  firebase.clearFirestoreData({
    projectId: FIRESTORE_PROJECT_ID,
  });
});

afterAll(() => {
  Promise.all(firebase.apps().map((app) => app.delete()));
});

it("renders component", () => {
  const auth = new Auth(app);
  const pageRepository = new PageRepository(app);
  const noteBookRepository = new NoteBookRepository(app);
  const { getByText } = render(
    <App
      auth={auth}
      history={history}
      pageRepository={pageRepository}
      noteBookRepository={noteBookRepository}
    />
  );
  expect(getByText("NoteBooks")).toBeInTheDocument();
});
