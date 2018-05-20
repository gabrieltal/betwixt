import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';

class StoryForm extends React.Component {
  constructor (props) {
    super(props);
    let subtitle = this.props.story.subtitle || '';
    let tags = this.props.story.tags || [];
    this.state = {
      id: this.props.story.id,
      title: this.props.story.title,
      author_id: this.props.story.authorId,
      body: this.props.story.body,
      subtitle: subtitle,
      imageUrl: this.props.story.image_url,
      imageFile: null,
      placeholder: 'Write something decent...',
      tags: tags
    };
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuillChange = this.handleQuillChange.bind(this);
    this.fileAdd = this.fileAdd.bind(this);
    this.addTags = this.addTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  update(field) {
    return e => this.setState({
      [field]: e.target.value
    });
  }

  componentDidMount() {
    let tagInput = document.getElementById('tag-input');
    tagInput.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        this.addTags(tagInput.value);
        tagInput.value = '';
      }
    })
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
    formData.append("story[subtitle]", this.state.subtitle);
    formData.append("story[all_tags]", this.state.tags);
    if (this.state.imageFile) formData.append("story[image]", this.state.imageFile);

    this.props.action(formData)
      .then(data => this.props.history.push(`/story/${Object.keys(data.story)[0]}`));
  }

  displayTags() {
    if (this.state.tags.length > 0) {
      let tagDisplay = this.state.tags.map(tag =>
        <li>
          <p>{tag}</p>
          <span id="remove-tag" onClick={this.removeTag}>
            x
          </span>
        </li>
      );

      return (
        <ul className="tag-form-display">
          {tagDisplay}
        </ul>
      );
    } else {
      return (
        <ul className="tag-list">
        </ul>
      )
    }
  }

  addTags(tag) {
    if (tag.trim().length === 0) {return};
    let addedTag = this.state.tags;
    if (addedTag.length === 0) {
      addedTag = [tag.trim()];
    } else {
      if (!this.state.tags.includes(tag.trim())) {
        addedTag.push(tag.trim());
      }
    }

    this.setState({
      tags: addedTag
    })

    if (this.state.tags.length === 5) {
      let tagInput = document.getElementById('tag-input');
      let tagMessage = document.getElementById('tag-message');
      tagInput.style.display = 'none';
      tagMessage.style.display = 'inline-block';
    }
  }

  removeTag(e) {
    let parent = e.target.parentElement;
    let toDeleteTag = parent.firstChild.innerHTML;
    let tags = [];
    this.state.tags.forEach((tag, i) => {
      if (tag !== toDeleteTag) {
        tags.push(tag);
      }
    });

    this.setState({
      tags: tags
    });

    if (this.state.tags.length <= 5) {
      let tagInput = document.getElementById('tag-input');
      let tagMessage = document.getElementById('tag-message');
      tagInput.style.display = 'inline-block';
      tagMessage.style.display = 'none';
    }
  }

  render () {
    let errors = this.props.errors.map((error, i) => <li key={i}>{error}</li>);
    return (
      <div className="story-form" >
      <link href={"https://cdn.quilljs.com/1.3.6/quill.snow.css"} rel="stylesheet"/>
        <input className="title-input" placeholder="Title" type="text" value={this.state.title} onChange={this.update('title')}/>
        <br/>
        <input className="subtitle-input"
          placeholder="Tell a little about your story..."
          type="text" value={this.state.subtitle}
          onChange={this.update('subtitle')}/>
        <br/>
        <label className="header-image-label">Add a header image...
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
        {this.displayTags()}
        <input id="tag-input"
          placeholder="Add a tag..."
          type="text"
          />
        <p id="tag-message">Limit of 5 tags, add or change tags so readers know what your story is about</p>
        <br/>
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
