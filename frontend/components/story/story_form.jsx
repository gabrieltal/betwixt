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
      imageUrl: this.props.story.image_url,
      imageFile: null,
      placeholder: 'Write something decent...'
    };
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuillChange = this.handleQuillChange.bind(this);
    this.fileAdd = this.fileAdd.bind(this);
  }

  update(field) {
    return e => this.setState({
      [field]: e.target.value
    });
  }

  goBack () {
    this.props.history.push('/');
  }

  handleQuillChange (value) {
    this.setState({body: value})
  }

  fileAdd (e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];
    reader.onloadend = () =>
      this.setState({
        imageUrl: reader.result,
        imageFile: file
      });
    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({ imageUrl: "", imageFile: null });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("story[title]", this.state.title);
    formData.append("story[body]", this.state.body);
    formData.append("story[author_id]", this.props.authorId);
    formData.append("story[id]", this.props.story.id);
    if (this.state.imageFile) formData.append("story[image]", this.state.imageFile);

    this.props.action(formData)
      .then(data => this.props.history.push(`/story/${Object.keys(data.story)[0]}`));
  }

  render () {
    let errors = this.props.errors.map((error, i) => <li key={i}>{error}</li>);

    return (
      <div className="story-form" >
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>
        <label className="title-label">Title:
          <input className="title-input" type="text" value={this.state.title} onChange={this.update('title')}/>
        </label>
        <br/>
        <label className="header-image-label">Header Image:
          <input className="image-input" type="file" onChange={this.fileAdd}/>
          <img className="story-header-img" src={this.state.imageUrl} />
        </label>
        <br/>
        <ReactQuill
          theme="snow"
          value={this.state.body}
          onChange={this.handleQuillChange}
          modules={StoryForm.modules}
          formats={StoryForm.formats}
          placeholder={this.state.placeholder}
        />
        <ul className="error-message">
          {errors}
        </ul>
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
    ['image']
  ],
}

StoryForm.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default withRouter(StoryForm);
