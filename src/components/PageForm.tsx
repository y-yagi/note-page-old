import Auth from "../libs/Auth";
import PageRespository from "../libs/PageRepository";
import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Form, Dimmer, Loader } from "semantic-ui-react";

interface Props {
  auth: Auth;
  pageRepository: PageRespository;
  pageID: string;
  onUpdatePage: () => void;
  onCancelPage: () => void;
}

function PageForm(props: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [action, setAction] = useState("create");
  const [updatedAt, setUpdatedAt] = useState(0);
  const [loading, setLoading] = useState(false);
  const onUpdatePage = props.onUpdatePage;
  const onCancelPage = props.onCancelPage;

  useEffect(() => {
    (async (id: string) => {
      if (id !== "") {
        setLoading(true);
        props.pageRepository
          .page(id)
          .get()
          .then((snapshot) => {
            const page = snapshot.data();

            setName(page.name);
            setContent(page.content);
            setAction("update");
            setLoading(false);
          });
      } else {
        cleanupFormForCreate();
      }
    })(props.pageID);
  }, [props.pageID, updatedAt, props.pageRepository]);

  function handleChangeName(event: React.FormEvent<HTMLInputElement>): void {
    setName((event.target as HTMLInputElement).value);
  }

  function handleChangeContent(
    event: React.FormEvent<HTMLTextAreaElement>
  ): void {
    setContent((event.target as HTMLInputElement).value);
  }

  function handleCancel(): void {
    cleanupFormForCreate();
    onCancelPage();
  }

  function cleanupFormForCreate(): void {
    setName("");
    setContent("");
    setAction("create");
  }

  function scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function onSubmitPage(event: React.FormEvent<HTMLFormElement>): void {
    let data = {
      name: name,
      content: content,
      userId: props.auth.userID(),
      createdAt: props.pageRepository.timestamp(),
      updatedAt: props.pageRepository.timestamp(),
    };

    if (props.pageID === "") {
      props.pageRepository.pages().add(data);
    } else {
      data["createdAt"] = null;
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
    <span>
      <Dimmer active={loading}>
        <Loader inverted>Loading...</Loader>
      </Dimmer>
      <Form onSubmit={(event) => onSubmitPage(event)}>
        <Form.Field required>
          <label>Page Name</label>
          <input
            placeholder="Name"
            required
            value={name}
            onChange={handleChangeName}
            data-testid="pagename"
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
    </span>
  );
}

export default PageForm;
