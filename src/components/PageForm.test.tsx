import React from "react";
import ReactDOM from "react-dom";
import PageForm from "./PageForm";
import * as firebase from "@firebase/testing";
import Auth from "../auth/Auth";

const FIRESTORE_PROJECT_ID = "my-test-project";

beforeEach(() => {
  firebase.initializeTestApp({
    projectId: FIRESTORE_PROJECT_ID,
    auth: { uid: "alice", email: "alice@example.com" }
  });
})

it("renders without crashing", () => {
  const div = document.createElement("div");
  const auth = new Auth();
  ReactDOM.render(<PageForm auth={auth} firebase={firebase} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
