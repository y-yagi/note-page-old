import Auth from "../auth/Auth";
import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Form } from "semantic-ui-react";

interface Props {
  auth: Auth;
  pageID: string;
}

function PageForm(props: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [action, setAction] = useState("create");

  useEffect(() => {
    fetchPage(props.pageID);
    // eslint-disable-next-line
  }, [props.pageID]);

  async function fetchPage(id: string) {
    if (id !== "") {
      props.auth.firebase
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

  function scrollToBottom(_): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function onSubmitPage(event): void {
    const data = {
      name: name,
      content: content,
      userId: props.auth.userID(),
      createdAt: props.auth.firebase.timestamp()
    };

    if (props.pageID === "") {
      props.auth.firebase.pages().add(data);
    } else {
      props.auth.firebase.page(props.pageID).set(data);
    }

    setName("");
    setContent("");
    setAction("create");

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
      <Button type="submit">{action}</Button>
    </Form>
  );
}

export default PageForm;
