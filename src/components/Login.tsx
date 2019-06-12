import React, { Component } from "react";
import {
  Container,
  Dimmer,
  Loader,
  Header,
  Button,
  Form
} from "semantic-ui-react";
import "./Login.css";
import Auth from "../auth/Auth";

interface Props {
  auth: Auth;
}
interface State {
  loading: boolean;
}

class Login extends Component<Props, State> {
  readonly state: State = {
    loading: true
  };

  componentDidMount() {
    this.doLogin();
  }

  login() {
    this.props.auth.login();
  }

  doLogin() {
    this.props.auth.firebase.auth.getRedirectResult().then(authResult => {
      if (authResult.user != null) {
        this.props.auth.handleAuthentication(authResult);
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    let { loading } = this.state;

    return (
      <Container text className="Login-container">
        <Header as="h2" icon textAlign="center" color="grey">
          <Header.Content>NotePage</Header.Content>
          <Dimmer active={loading}>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
          <Form className="Login-form">
            <Button
              id="qsLoginBtn"
              className="btn-margin"
              onClick={this.login.bind(this)}
            >
              Log In
            </Button>
          </Form>
        </Header>
      </Container>
    );
  }
}

export default Login;
