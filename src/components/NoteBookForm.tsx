import Auth from "../libs/Auth";
import NoteBookRepository from "../libs/NoteBookRepository";
import React, { ReactComponentElement } from "react";
import { Formik } from "formik";
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

interface FormValues {
  name: string;
}

function NoteBookForm(props: Props) {
  function handleCancel(): void {
    props.history.push("/");
  }

  function onSubmitPage(values: FormValues): void {
    let data = {
      name: values["name"],
      userId: props.auth.userID(),
      createdAt: props.noteBookRepository.timestamp(),
      updatedAt: props.noteBookRepository.timestamp(),
    };

    props.noteBookRepository.notebooks().add(data);
    props.history.push("/");
  }

  function form(): ReactComponentElement<typeof Formik> {
    return (
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitPage(values);
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Note Book Name</label>
              <input
                placeholder="Name"
                required
                name="name"
                onChange={handleChange}
                value={values.name}
                data-testid="notebookname"
              />
            </Form.Field>
            <Button as="a" onClick={() => handleCancel()}>
              cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} color="blue">
              create
            </Button>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Container className="main-container">
      <Header as="h2" icon textAlign="center" color="grey">
        <Icon name="write" circular />
      </Header>
      <Divider hidden section />
      {form()}
    </Container>
  );
}

export default NoteBookForm;
