import React from 'react';
class StoryForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      author_id: this.props.authorId,
      quill: 'hi'
    };
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
      body: JSON.stringify(this.state.quill.getText()),
      author_id: this.props.authorId
    };
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
        <label>Title:
        <input type="text" value={this.state.title} onChange={this.update('title')}/>
        </label>
        <div id="editor"></div>
        <button onClick={this.handleSubmit}>Continue</button>
      </div>
    );
  }
}


export default StoryForm;
