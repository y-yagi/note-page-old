import React, { useState, useEffect } from "react";
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
import Firebase from "../firebase/firebase";

interface Props {
  auth: Auth;
  firebase: Firebase;
}
interface State {
  loading: boolean;
}

function Login(props: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doLogin();
  });

  function login(): void {
    props.firebase.login();
  }

  function doLogin(): void {
    props.firebase.auth.getRedirectResult().then(authResult => {
      if (authResult.user != null) {
        props.auth.handleAuthentication(authResult);
      } else {
        setLoading(false);
      }
    });
  }

  return (
    <Container text className="Login-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Header.Content>NotePage</Header.Content>
        <Dimmer active={loading}>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
        <Form className="Login-form">
          <Button id="qsLoginBtn" className="btn-margin" onClick={login}>
            Log In
          </Button>
        </Form>
      </Header>
    </Container>
  );
}

export default Login;
