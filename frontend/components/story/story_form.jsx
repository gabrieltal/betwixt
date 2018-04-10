import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Delta from 'quill-delta';
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
      body: (JSON.stringify(this.state.quill.getContents())),
      author_id: this.props.authorId,
      id: this.props.story.id
    };
    this.props.action(story).then(
      data =>
        this.props.history.push(`/story/${Object.keys(data.story)[0]}`)
      );
  }

  componentDidMount () {
    let delta = new Delta([
  { insert: 'Gandalf', attributes: { bold: true } },
  { insert: ' the ' },
  { insert: 'Grey', attributes: { color: '#ccc' } }
  ]);

    let text = delta.map(function(op) {
      if (typeof op.insert === 'string') {
        return op.insert;
      } else {
        return '';
      }
    }).join('');
    let packet = JSON.stringify(delta)
    console.log(packet);
    let other = new Delta(JSON.parse(packet));
    let chained = new Delta().insert('hello').insert('!', { bold: true});
    console.log(other);
    console.log(chained);
    debugger;
    let quill = new Quill('#editor', {
      modules: {
        toolbar: [
          [{header: [1, 2, false]}],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      placeholder: 'Compose something decent...',
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
