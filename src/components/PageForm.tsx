import Auth from "../auth/Auth";
import React, { Component } from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

interface Props {
  auth: Auth;
}
interface State {
  name: string;
  content: string;
}

class PageForm extends Component<Props, State> {
  readonly state: State = {
    name: "",
    content: ""
  };

  constructor(props) {
    super(props);

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.onCreatePage = this.onCreatePage.bind(this);
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  handleChangeContent(event) {
    this.setState({ content: event.target.value });
  }

  onCreatePage = event => {
    this.props.auth.firebase.pages().add({
      name: this.state.name,
      content: this.state.content,
      userId: this.props.auth.userID(),
      createdAt: this.props.auth.firebase.timestamp()
    });

    this.setState({ name: "", content: "" });
    event.preventDefault();
  };

  render() {
    const { name, content } = this.state;

    return (
      <Form onSubmit={event => this.onCreatePage(event)}>
        <Form.Field required>
          <label>Page Name</label>
          <input
            placeholder="Name"
            required
            value={name}
            onChange={this.handleChangeName}
          />
        </Form.Field>
        <Form.Field required>
          <label>Content</label>
          <TextArea
            placeholder="Content"
            required
            value={content}
            onChange={this.handleChangeContent}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
}

export default PageForm;
