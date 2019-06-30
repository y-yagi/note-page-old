import React, { Component } from "react";
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
interface State {
  pages: Array<Page>;
  selectedPageID: string;
  cancelConfirm: boolean;
  loading: boolean;
}

class App extends Component<Props, State> {
  readonly state: State = {
    pages: [],
    selectedPageID: "",
    cancelConfirm: false,
    loading: true
  };

  unsubscribe: firebase.Unsubscribe;

  constructor(props) {
    super(props);

    this.unsubscribe = null;
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleDestroyConfirm = this.handleDestroyConfirm.bind(this);
    this.handleDestroyCancel = this.handleDestroyCancel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.auth.firebase
      .pages()
      .where("userId", "==", this.props.auth.userID())
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        let pages = [];
        if (snapshot.size) {
          snapshot.forEach(doc => pages.push({ ...doc.data(), uid: doc.id }));
        }
        this.setState({ pages: pages, selectedPageID: "", loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleDestroy(id) {
    this.setState({ cancelConfirm: false });
    this.props.auth.firebase.page(id).delete();
  }

  handleDestroyConfirm() {
    this.setState({ cancelConfirm: true });
  }

  handleDestroyCancel() {
    this.setState({ cancelConfirm: false });
  }

  handleEdit(id) {
    this.setState({ selectedPageID: id });
  }

  render() {
    let { loading, pages, selectedPageID, cancelConfirm } = this.state;
    let panes = [];

    pages.forEach(page =>
      panes.push({
        menuItem: page.name,
        render: () => (
          <Tab.Pane>
            <Button
              type="submit"
              floated="right"
              color="red"
              size="mini"
              onClick={() => this.handleDestroyConfirm()}
            >
              Destroy
            </Button>
            <Confirm
              open={cancelConfirm}
              onCancel={() => this.handleDestroyCancel()}
              onConfirm={() => this.handleDestroy(page.uid)}
            />
            <Button
              type="submit"
              floated="right"
              color="blue"
              size="mini"
              onClick={() => this.handleEdit(page.uid)}
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
          <Tab panes={panes} />
        </Segment>
        <Divider hidden section />
        <PageForm auth={this.props.auth} pageID={selectedPageID} />
      </Container>
    );
  }
}

export default App;
