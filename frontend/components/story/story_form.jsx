import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';

class StoryForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      id: this.props.story.id,
      title: this.props.story.title,
      author_id: this.props.story.authorId,
      body: this.props.story.body,
      placeholder: 'Write something decent...'
    };
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuillChange = this.handleQuillChange.bind(this);
  }

  update(field) {
    return e => this.setState({
      [field]: e.target.value
    });
  }

  handleQuillChange (value) {
    this.setState({body: value})
  }

  handleSubmit(e) {
    e.preventDefault();
    const story = {
      title: this.state.title,
      body: (this.state.body),
      author_id: this.props.authorId,
      id: this.props.story.id
    };

    this.props.action(story).then(
      data =>
        this.props.history.push(`/story/${Object.keys(data.story)[0]}`)
      );
  }

  render () {

    return (
      <div className="story-form" >
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>
        <label className="title-label">Title:
          <input className="title-input" type="text" value={this.state.title} onChange={this.update('title')}/>
        </label>
        <ReactQuill
          theme="snow"
          value={this.state.body}
          onChange={this.handleQuillChange}
          modules={StoryForm.modules}
          formats={StoryForm.formats}
          placeholder={this.state.placeholder}
        />
        <button className="input-publish" onClick={this.handleSubmit}>Publish</button>
      </div>
    );
  }
}
StoryForm.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
}

StoryForm.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default withRouter(StoryForm);
