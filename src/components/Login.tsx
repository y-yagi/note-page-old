import React, { Component } from "react";
import { Container, Header, Button, Form } from "semantic-ui-react";
import "./Login.css";
import Auth from "../auth/Auth";

interface Props {
  auth: Auth;
}

class Login extends Component<Props, {}> {
  componentDidMount() {
    this.doLogin();
  }

  login() {
    this.props.auth.login();
  }

  doLogin() {
    // TODO: show loader
    this.props.auth.firebase.auth.getRedirectResult().then(authResult => {
      if (authResult.user != null) {
        this.props.auth.handleAuthentication(authResult);
      }
    });
  }

  render() {
    return (
      <Container text className="Login-container">
        <Header as="h2" icon textAlign="center" color="grey">
          <Header.Content>NotePage</Header.Content>
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
