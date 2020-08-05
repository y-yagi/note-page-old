import Auth from "../libs/Auth";
import PageRespository from "../libs/PageRepository";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Form, Dimmer, Loader } from "semantic-ui-react";

interface Props {
  auth: Auth;
  pageRepository: PageRespository;
  pageID: string;
  noteBookID: string;
  onUpdatePage: () => void;
  onCancelPage: () => void;
}

interface FormValues {
  name: string;
  content: string;
}

function PageForm(props: Props) {
  const [defaultName, setDefaultName] = useState("");
  const [defaultContent, setDefaultContent] = useState("");
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

            setDefaultName(page.name);
            setDefaultContent(page.content);
            setAction("update");
            setLoading(false);
          });
      } else {
        cleanupFormForCreate();
      }
    })(props.pageID);
  }, [props.pageID, updatedAt, props.pageRepository]);

  function handleCancel(): void {
    cleanupFormForCreate();
    onCancelPage();
  }

  function cleanupFormForCreate(): void {
    setDefaultName("");
    setDefaultContent("");
    setAction("create");
  }

  function scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function onSubmitPage(values: FormValues): void {
    let data = {
      name: values["name"],
      content: values["content"],
      userId: props.auth.userID(),
      noteBookId: props.noteBookID,
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
    setDefaultName("");
    setDefaultContent("");
    setAction("create");
    onUpdatePage();
  }

  return (
    <span>
      <Dimmer active={loading}>
        <Loader inverted>Loading...</Loader>
      </Dimmer>
      <Formik
        initialValues={{ name: defaultName, content: defaultContent }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitPage(values);
        }}
        enableReinitialize={true}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Field required>
              <label>Page Name</label>
              <input
                placeholder="Name"
                required
                name="name"
                onChange={handleChange}
                value={values.name}
                data-testid="pagename"
              />
            </Form.Field>
            <Form.Field required>
              <label>Content</label>
              <TextareaAutosize
                name="content"
                placeholder="Content"
                required
                value={values.content}
                onChange={handleChange}
                onHeightChange={scrollToBottom}
                data-testid="pagecontent"
              />
            </Form.Field>
            <Button as="a" onClick={() => handleCancel()}>
              cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} color="blue">
              {action}
            </Button>
          </Form>
        )}
      </Formik>
    </span>
  );
}

export default PageForm;
