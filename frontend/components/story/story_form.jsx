import React from 'react';
class StoryForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      author_id: this.props.authorId,
      quill: ''
    };
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    console.log(this.state);
    return e => this.setState({
      [field]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const story = {
      title: this.state.title,
      body: JSON.stringify(this.state.quill.root.innerHTML()),
      author_id: this.props.authorId
    };
    this.props.createStory(story).then(this.props.history.push(`/`));
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
        <input type="text" value={this.state.title} onChange={this.update('title')}/>
        <div id="editor">
        </div>
        <button onClick={this.handleSubmit}>Continue</button>
      </div>
    );
  }
}


export default StoryForm;
