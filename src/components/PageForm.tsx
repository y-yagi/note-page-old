import Auth from "../auth/Auth";
import Firebase from "../firebase/firebase";
import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Form } from "semantic-ui-react";

interface Props {
  auth: Auth;
  firebase: Firebase;
  pageID: string;
  onUpdatePage: () => void;
}

function PageForm(props: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [action, setAction] = useState("create");
  const [updatedAt, setUpdatedAt] = useState(0);
  const onUpdatePage = props.onUpdatePage;

  useEffect(() => {
    fetchPage(props.pageID);
    // eslint-disable-next-line
  }, [props.pageID, updatedAt]);

  async function fetchPage(id: string) {
    if (id !== "") {
      props.firebase
        .page(id)
        .get()
        .then(snapshot => {
          const page = snapshot.data();

          setName(page.name);
          setContent(page.content);
          setAction("update");
        });
    }
  }

  function handleChangeName(event): void {
    setName(event.target.value);
  }

  function handleChangeContent(event): void {
    setContent(event.target.value);
  }

  function handleCancel(): void {
    setName("");
    setContent("");
    setAction("create");
  }

  function scrollToBottom(_): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function onSubmitPage(event): void {
    const data = {
      name: name,
      content: content,
      userId: props.auth.userID(),
      updatedAt: props.firebase.timestamp()
    };

    if (props.pageID === "") {
      data["createdAt"] = data["updatedAt"];
      props.firebase.pages().add(data);
    } else {
      props.firebase.page(props.pageID).update(data);
    }

    const d = new Date();

    setUpdatedAt(d.getTime());
    setName("");
    setContent("");
    setAction("create");
    onUpdatePage();

    event.preventDefault();
  }

  return (
    <Form onSubmit={event => onSubmitPage(event)}>
      <Form.Field required>
        <label>Page Name</label>
        <input
          placeholder="Name"
          required
          value={name}
          onChange={handleChangeName}
        />
      </Form.Field>
      <Form.Field required>
        <label>Content</label>
        <TextareaAutosize
          placeholder="Content"
          required
          value={content}
          onChange={handleChangeContent}
          onHeightChange={scrollToBottom}
        />
      </Form.Field>
      <Button as="a" onClick={() => handleCancel()}>
        cancel
      </Button>
      <Button type="submit" color="blue">
        {action}
      </Button>
    </Form>
  );
}

export default PageForm;
