import React from "react";
import ReactDOM from "react-dom";
import PageForm from "./PageForm";
import * as firebase from "@firebase/testing";
import Auth from "../libs/Auth";
import PageRepository from "../libs/PageRepository";
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
  const { getByText } = render(
    <PageForm
      auth={auth}
      pageRepository={pageRepository}
      pageID={""}
      onUpdatePage={() => console.log("call onUpdatePage")}
      onCancelPage={() => console.log("call onCancelPage")}
    />
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
      onCancelPage={() => console.log("call onCancelPage")}
    />
  );

  const name = getByTestId("pagename");
  fireEvent.change(name, { target: { value: "new page" } });

  const content = getByTestId("pagecontent");
  fireEvent.change(content, { target: { value: "Content" } });

  fireEvent.click(getByText("create"));

  const resp = await pageRepository.pages().get();
  resp.forEach((doc) => {
    const data = doc.data();
    expect(data.name).toBe("new page");
    expect(data.content).toBe("Content");
  });
});

it("update a exist page", async () => {
  const auth = new Auth(app);
  const pageRepository = new PageRepository(app);
  const page = await pageRepository
    .pages()
    .add({ name: "new1", content: "content1" });

  const { getByText, getByTestId, findByText } = render(
    <PageForm
      auth={auth}
      pageRepository={pageRepository}
      pageID={page.id}
      onUpdatePage={() => console.log("call onUpdatePage")}
      onCancelPage={() => console.log("call onCancelPage")}
    />
  );

  await findByText("update");

  const name = getByTestId("pagename");
  fireEvent.change(name, { target: { value: "update page" } });

  const content = getByTestId("pagecontent");
  fireEvent.change(content, { target: { value: "Updateed Content" } });
  findByText("Updateed Content");

  act(() => {
    fireEvent.click(getByText("update"));
  });

  const resp = await pageRepository.pages().get();
  resp.forEach((doc) => {
    const data = doc.data();
    expect(data.name).toBe("update page");
    expect(data.content).toBe("Updateed Content");
  });
});
