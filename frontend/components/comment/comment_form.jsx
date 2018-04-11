import React from 'react';
import ReactQuill from 'react-quill';
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
    this.props.createComment(this.state);
  }

  render () {
    let ableToComment = () => this.props.openModal("comment-login");
    if (!!this.state.author_id) {
      ableToComment = this.handleQuillChange;
    }
    let errors = this.props.errors.map((error, i) => <li key={i}>{error}</li> );
    return (
      <form>
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>

        <ReactQuill theme='snow' value={this.state.body}
          onChange={ableToComment} modules={CommentForm.modules}
          formats={CommentForm.formats} placeholder={this.state.placeholder}
        />
        <ul>
          {errors}
        </ul>

        <button onClick={this.handleSubmit}>Publish</button>
      </form>
    );
  }
}
CommentForm.modules = {
  toolbar: [
  ]
}

CommentForm.formats = []

export default CommentForm;
