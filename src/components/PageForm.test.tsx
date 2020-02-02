import React from "react";
import ReactDOM from "react-dom";
import PageForm from "./PageForm";
import * as firebase from "@firebase/testing";
import Auth from "../libs/Auth";
import PageRepository from "../libs/PageRepository";
import { render } from "@testing-library/react";

const FIRESTORE_PROJECT_ID = "my-test-project";
const app = firebase.initializeTestApp({
  projectId: FIRESTORE_PROJECT_ID,
  auth: { uid: "alice", email: "alice@example.com" }
});

beforeEach(() => {});

it("renders welcome message", () => {
  console.log(app.firestore);
  const auth = new Auth(app);
  const pageRepository = new PageRepository(app);
  const { getByText } = render(
    <PageForm auth={auth} pageRepository={pageRepository} />
  );
  expect(getByText("Page Name")).toBeInTheDocument();
});
