import React, { Component } from "react";
import "./App.css";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import PageForm from "./PageForm";
import Auth from "../auth/Auth";
import {
  Container,
  Divider,
  Icon,
  Dimmer,
  Loader,
  Header,
  Button,
  Segment,
  Tab
} from "semantic-ui-react";

interface Props {
  auth: Auth;
}
interface State {
  processing: boolean;
  pages: Array<any>;
}

class App extends Component<Props, State> {
  readonly state: State = {
    processing: false,
    pages: []
  };

  unsubscribe: any;

  constructor(props) {
    super(props);

    this.unsubscribe = null;
    this.handleDestroy = this.handleDestroy.bind(this);
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
        this.setState({ pages: pages });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleDestroy(id) {
    this.props.auth.firebase.page(id).delete();
  }

  render() {
    let { processing, pages } = this.state;
    let panes = [];

    console.log(pages);
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
              onClick={() => this.handleDestroy(page.uid)}
            >
              Destroy
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
          <Dimmer active={processing}>
            <Loader inverted>Processing...</Loader>
          </Dimmer>
        </Header>
        <Divider hidden section />
        <Segment>
          <Tab panes={panes} />
        </Segment>
        <Divider hidden section />
        <PageForm auth={this.props.auth} />
      </Container>
    );
  }
}

export default App;
