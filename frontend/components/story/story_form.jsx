import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class StoryForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      id: this.props.story.id,
      title: this.props.story.title,
      author_id: this.props.story.authorId,
      quill: '',
      body: this.props.story.body
    };
    debugger;
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => this.setState({
      [field]: e.target.value

    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const story = {
      title: this.state.title,
      body: (this.state.quill.getText()),
      author_id: this.props.authorId,
      id: this.props.story.id
    };
    debugger;
    this.props.action(story).then(
      data =>
        this.props.history.push(`/story/${Object.keys(data.story)[0]}`)
      );
  }

  componentDidMount () {
    let quill = new Quill('#editor', {
      theme: 'snow'
    });
    this.setState({
      quill: quill
    });
  }


  render () {
    return (
      <div className="story-form">
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>
        <label className="title-label">Title:
          <input className="title-input" type="text" value={this.state.title} onChange={this.update('title')}/>
        </label>
        <div id="editor">{this.state.body}</div>
        <button className="input-publish" onClick={this.handleSubmit}>Publish</button>
      </div>
    );
  }
}


export default withRouter(StoryForm);
