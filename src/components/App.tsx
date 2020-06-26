import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import PageForm from "./PageForm";
import Auth from "../libs/Auth";
import PageRepostitory from "../libs/PageRepository";
import NoteBookRepostitory from "../libs/NoteBookRepository";
import { History } from "history";
import {
  Container,
  Confirm,
  Divider,
  Icon,
  Dimmer,
  Loader,
  Header,
  Button,
  Segment,
  Select,
  Tab,
  TabProps,
} from "semantic-ui-react";

interface Page {
  id: string;
  name: string;
  content: string;
  uid: string;
}

interface Props {
  auth: Auth;
  pageRepository: PageRepostitory;
  noteBookRepository: NoteBookRepostitory;
  history: History;
}

function App(props: Props) {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageID, setSelectedPageID] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabActiveIndex, setTabActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const unsubscribeRef = useRef<firebase.Unsubscribe>();

  const selectOptions = [
    { key: "af", value: "af", text: "Afghanistan" },
    { key: "ax", value: "ax", text: "Aland Islands" },
    {
      key: "create_new_note_book",
      value: "create_new_note_book",
      text: "Create a new note book",
    },
  ];

  useEffect(() => {
    (async () => {
      unsubscribeRef.current = props.pageRepository
        .pages()
        .where("userId", "==", props.auth.userID())
        .orderBy("updatedAt", "desc")
        .onSnapshot((snapshot) => {
          let pages: Page[] = [];
          if (snapshot.size) {
            for (const doc of snapshot.docs) {
              let page = { uid: doc.id, ...doc.data() } as Page;
              pages.push(page);
            }
          }

          setPages(pages);
          setLoading(false);
        });
    })();

    return () => {
      unsubscribeRef.current();
    };
  }, [props.auth, props.pageRepository]);

  function handleDestroy(id: string): void {
    setSelectedPageID("");
    setCancelConfirm(false);
    props.pageRepository.page(id).delete();
    setTabActiveIndex(0);
  }

  function handleDestroyConfirm(): void {
    setCancelConfirm(true);
  }

  function handleDestroyCancel(): void {
    setCancelConfirm(false);
  }

  function handleCreate(): void {
    setSelectedPageID("");
    setShowForm(true);
  }

  function handleEdit(id: string): void {
    setShowForm(true);
    setSelectedPageID(id);
  }

  function handleTabChange(data: TabProps) {
    setShowForm(false);
    setTabActiveIndex(data.activeIndex as number);
  }

  function onUpdatePage(): void {
    setTabActiveIndex(0);
    setShowForm(false);
  }

  function onCancelPage(): void {
    setShowForm(false);
  }

  function onSelectChange(_event: any, data: any): void {
    if (data.value === "create_new_note_book") {
      props.history.push("/notebooks/new")
    }
  }

  function panes() {
    let panes: any[] = [];

    pages.forEach((page) =>
      panes.push({
        menuItem: page.name,
        render: () => (
          <Tab.Pane className="Tab-body">
            <Button
              type="submit"
              floated="right"
              color="red"
              size="mini"
              onClick={() => handleDestroyConfirm()}
            >
              Destroy
            </Button>
            <Confirm
              open={cancelConfirm}
              onCancel={() => handleDestroyCancel()}
              onConfirm={() => handleDestroy(page.uid)}
            />
            <Button
              type="submit"
              floated="right"
              color="blue"
              size="mini"
              onClick={() => handleEdit(page.uid)}
            >
              Edit
            </Button>
            <Interweave
              content={page.content}
              matchers={[new UrlMatcher("url", { customTLDs: ["app"] })]}
              newWindow
            />
          </Tab.Pane>
        ),
      })
    );

    return panes;
  }

  return (
    <Container className="main-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Icon name="write" circular />
        <Dimmer active={loading}>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
      </Header>
      <Header as="h3" icon textAlign="center" color="grey">
        <Select
          options={selectOptions}
          defaultValue="af"
          onChange={onSelectChange}
        />
      </Header>
      <Divider hidden section />
      <Button as="a" color="blue" onClick={() => handleCreate()}>
        Create a new page
      </Button>
      <Segment>
        <Tab
          panes={panes()}
          menu={{ pointing: true, className: "Tab-wrapped" }}
          activeIndex={tabActiveIndex}
          onTabChange={handleTabChange}
        />
      </Segment>
      <Divider hidden section />
      {showForm ? (
        <PageForm
          auth={props.auth}
          pageRepository={props.pageRepository}
          pageID={selectedPageID}
          onUpdatePage={onUpdatePage}
          onCancelPage={onCancelPage}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
