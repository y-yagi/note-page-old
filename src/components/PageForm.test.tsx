import React from "react";
import ReactDOM from "react-dom";
import PageForm from "./PageForm";
import * as firebase from "@firebase/testing";
import Auth from "../libs/Auth";
import PageRepository from "../libs/PageRepository";
import { render, fireEvent } from "@testing-library/react";

const FIRESTORE_PROJECT_ID = "my-test-project";
const app = firebase.initializeTestApp({
  projectId: FIRESTORE_PROJECT_ID,
  auth: { uid: "alice", email: "alice@example.com" }
});

afterEach(() => {
  firebase.clearFirestoreData({
    projectId: FIRESTORE_PROJECT_ID
  });
});

it("renders welcome message", () => {
  const auth = new Auth(app);
  const pageRepository = new PageRepository(app);
  const { getByText } = render(
    <PageForm auth={auth} pageRepository={pageRepository} pageID={""} />
  );
  expect(getByText("Page Name")).toBeInTheDocument();
});

it("register new page", async () => {
  const auth = new Auth(app);
  const pageRepository = new PageRepository(app);
  const { getByText, getByTestId } = render(
    <PageForm
      auth={auth}
      pageRepository={pageRepository}
      pageID={""}
      onUpdatePage={() => console.log("call onUpdatePage")}
    />
  );

  const name = getByTestId("pagename");
  fireEvent.change(name, { target: { value: "new page" } });

  const content = getByTestId("pagecontent");
  fireEvent.change(content, { target: { value: "Content" } });

  fireEvent.click(getByText("create"));

  const resp = await pageRepository.pages().get();
  resp.forEach(doc => {
    const data = doc.data();
    expect(data.name).toBe("new page");
    expect(data.content).toBe("Content");
  });
});
