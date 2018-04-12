import React from 'react';
import ReactQuill from 'react-quill';
import {withRouter} from 'react-router-dom';
class CommentForm extends React.Component {
  constructor (props) {
    super(props);
    let currentUserId = '';
    if (!!this.props.currentUser) {
      currentUserId = Object.keys(this.props.currentUser)[0];
    }
    this.state = {
      author_id: currentUserId,
      story_id: this.props.storyId,
      body: '',
      placeholder: "Write a response..."
    };
    this.handleQuillChange = this.handleQuillChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount () {
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.currentUser !== nextProps.currentUser) {
      this.setState({author_id: Object.keys(nextProps.currentUser)[0]});
    }
  }

  handleQuillChange (value) {
    this.setState({body: value})
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createComment(this.state).then(this.props.clearErrors());
    this.setState({body: ""});
  }

  render () {
    let ableToSubmit = () => this.props.openModal("comment-login");
    if (!!this.state.author_id) {
      ableToSubmit = this.handleSubmit;
    }
    let errors = this.props.errors.map((error, i) => <li key={i}>{error}</li> );
    return (
      <form>
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>

        <ReactQuill theme='snow' value={this.state.body}
          onChange={this.handleQuillChange} modules={CommentForm.modules}
          formats={CommentForm.formats} placeholder={this.state.placeholder}
        />
        <ul className="error-message">
          {errors}
        </ul>

        <button onClick={ableToSubmit}>Publish</button>
      </form>
    );
  }
}
CommentForm.modules = {
  toolbar: [
  ]
}

CommentForm.formats = []

export default withRouter(CommentForm);
