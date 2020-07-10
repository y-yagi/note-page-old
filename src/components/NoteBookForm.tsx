import Auth from "../libs/Auth";
import NoteBookRepository from "../libs/NoteBookRepository";
import React, { useState } from "react";
import { History } from "history";
import "./App.css";
import {
  Container,
  Divider,
  Icon,
  Header,
  Button,
  Form,
} from "semantic-ui-react";

interface Props {
  auth: Auth;
  noteBookRepository: NoteBookRepository;
  history: History;
}

function NoteBookForm(props: Props) {
  const [name, setName] = useState("");

  function handleChangeName(event: React.FormEvent<HTMLInputElement>): void {
    setName((event.target as HTMLInputElement).value);
  }

  function handleCancel(): void {
    props.history.push("/");
  }

  function onSubmitPage(event: React.FormEvent<HTMLFormElement>): void {
    let data = {
      name: name,
      userId: props.auth.userID(),
      createdAt: props.noteBookRepository.timestamp(),
      updatedAt: props.noteBookRepository.timestamp(),
    };

    props.noteBookRepository.notebooks().add(data);
    setName("");
    event.preventDefault();
    props.history.push("/");
  }

  return (
    <Container className="main-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Icon name="write" circular />
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
            data-testid="notebookname"
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
