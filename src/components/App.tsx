import React, { useState, useEffect } from "react";
import "./App.css";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import PageForm from "./PageForm";
import Auth from "../auth/Auth";
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
  Tab
} from "semantic-ui-react";

interface Page {
  id: string;
  name: string;
  uid: string;
  content: string;
}

interface Props {
  auth: Auth;
}

function App(props: Props) {
  const [pages, setPages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabActiveIndex, setTabActiveIndex] = useState(0);

  let unsubscribe: firebase.Unsubscribe;

  useEffect(() => {
    fetchPages();

    return () => {
      unsubscribe();
    };
  }, []);

  async function fetchPages() {
    unsubscribe = props.auth.firebase
      .pages()
      .where("userId", "==", props.auth.userID())
      .orderBy("updatedAt", "desc")
      .onSnapshot(snapshot => {
        let pages = [];
        if (snapshot.size) {
          snapshot.forEach(doc => pages.push({ ...doc.data(), uid: doc.id }));
        }

        setPages(pages);
        setLoading(false);
      });
  }

  function handleDestroy(id: string): void {
    setCancelConfirm(false);
    props.auth.firebase.page(id).delete();
    setTabActiveIndex(0);
  }

  function handleDestroyConfirm(): void {
    setCancelConfirm(true);
  }

  function handleDestroyCancel(): void {
    setCancelConfirm(false);
  }

  function handleEdit(id: string): void {
    setSelectedPageID(id);
  }

  function handleTabChange(e, data) {
    setTabActiveIndex(data.activeIndex);
  }

  function onUpdatePage(): void {
    setTabActiveIndex(0);
  }

  function panes() {
    let panes = [];

    pages.forEach(page =>
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
              matchers={[new UrlMatcher("url")]}
              newWindow
            />
          </Tab.Pane>
        )
      })
    );

    return panes;
  }

  return (
    <Container className="main-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Icon name="write" circular />
        <Header.Content>NotePage</Header.Content>
        <Dimmer active={loading}>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
      </Header>
      <Divider hidden section />
      <Segment>
        <Tab
          panes={panes()}
          menu={{ pointing: true, className: "Tab-wrapped" }}
          activeIndex={tabActiveIndex}
          onTabChange={handleTabChange}
        />
      </Segment>
      <Divider hidden section />
      <PageForm
        auth={props.auth}
        pageID={selectedPageID}
        onUpdatePage={onUpdatePage}
      />
    </Container>
  );
}

export default App;
