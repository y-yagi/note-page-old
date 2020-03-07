import Auth from "../libs/Auth";
import { useInput } from "../hooks/use_input";
import PageRespository from "../libs/PageRepository";
import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Form } from "semantic-ui-react";

interface Props {
  auth: Auth;
  pageRepository: PageRespository;
  pageID: string;
  onUpdatePage: () => void;
}

function PageForm(props: Props) {
  const [nameProps, setName] = useInput("");
  const [contentProps, setContent] = useInput("");
  const [action, setAction] = useState("create");
  const [updatedAt, setUpdatedAt] = useState(0);
  const onUpdatePage = props.onUpdatePage;

  useEffect(() => {
    (async (id: string) => {
      if (id !== "") {
        props.pageRepository
          .page(id)
          .get()
          .then(snapshot => {
            const page = snapshot.data();

            setName(page.name);
            setContent(page.content);
            setAction("update");
          });
      }
    })(props.pageID);
  }, [props.pageID, props.pageRepository, updatedAt]);


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
      name: nameProps.value,
      content: contentProps.value,
      userId: props.auth.userID(),
      updatedAt: props.pageRepository.timestamp()
    };

    if (props.pageID === "") {
      data["createdAt"] = data["updatedAt"];
      props.pageRepository.pages().add(data);
    } else {
      props.pageRepository.page(props.pageID).update(data);
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
          {...nameProps}
          placeholder="Name"
          required
          data-testid="pagename"
        />
      </Form.Field>
      <Form.Field required>
        <label>Content</label>
        <TextareaAutosize
          {...contentProps}
          placeholder="Content"
          required
          onHeightChange={scrollToBottom}
          data-testid="pagecontent"
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
