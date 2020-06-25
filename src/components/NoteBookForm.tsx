import Auth from "../libs/Auth";
import PageRespository from "../libs/PageRepository";
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  Divider,
  Icon,
  Dimmer,
  Loader,
  Header,
  Button,
  Form,
} from "semantic-ui-react";

interface Props {
  auth: Auth;
  pageRepository: PageRespository;
}

function NoteBookForm(props: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChangeName(event: React.FormEvent<HTMLInputElement>): void {
    setName((event.target as HTMLInputElement).value);
  }

  function handleCancel(): void {
  }

  function onSubmitPage(event: React.FormEvent<HTMLFormElement>): void {
    let data = {
      name: name,
      userId: props.auth.userID(),
      createdAt: props.pageRepository.timestamp(),
      updatedAt: props.pageRepository.timestamp(),
    };

    setName("");
    event.preventDefault();
  }

  return (
    <Container className="main-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Icon name="write" circular />
        <Dimmer active={loading}>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
      </Header>
      <Divider hidden section />
      <Form onSubmit={(event) => onSubmitPage(event)}>
        <Form.Field required>
          <label>Note Book Name</label>
          <input
            placeholder="Name"
            required
            value={name}
            onChange={handleChangeName}
            data-testid="pagename"
          />
        </Form.Field>
        <Button as="a" onClick={() => handleCancel()}>
          cancel
        </Button>
        <Button type="submit" color="blue">
          create
        </Button>
      </Form>
    </Container>
  );
}

export default NoteBookForm;