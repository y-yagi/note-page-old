import React from "react";
import NoteBookForm from "./NoteBookForm";
import * as firebase from "@firebase/rules-unit-testing";
import Auth from "../libs/Auth";
import PageRepository from "../libs/PageRepository";
import NoteBookRepository from "../libs/NoteBookRepository";
import history from "../history";
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
  const noteBookRepository = new NoteBookRepository(app);
  const { getByText } = render(
    <NoteBookForm
      auth={auth}
      history={history}
      noteBookRepository={noteBookRepository}
    />
  );
  expect(getByText("Note Book Name")).toBeInTheDocument();
});

it("register new note book", async () => {
  const auth = new Auth(app);
  const noteBookRepository = new NoteBookRepository(app);
  const { getByText, getByTestId } = render(
    <NoteBookForm
      auth={auth}
      history={history}
      noteBookRepository={noteBookRepository}
    />
  );

  const name = getByTestId("notebookname");
  fireEvent.change(name, { target: { value: "new note" } });

  fireEvent.click(getByText("create"));

  const resp = await noteBookRepository.notebooks().get();
  resp.forEach((doc) => {
    const data = doc.data();
    expect(data.name).toBe("new note");
  });
});
