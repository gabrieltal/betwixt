import React from 'react';

class UserEdit extends React.Component {
  constructor (props) {
    super(props);
    const user = Object.values(this.props.user)[0];
    this.state = {
      id: user.id,
      username: user.username,
      bio: user.bio,
      image_url: user.image_url,
      imageUrl: user.image_url,
      imageFile: null
    };

    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileAdd = this.fileAdd.bind(this);
  }

  componentWillUnmount () {
    this.props.clearErrors();
  }

  update(field) {
    return e => this.setState({
      [field]: e.target.value
    });
  }

  fileAdd(e) {
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
      this.setState({ imageUrl: "", imageFile})
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("user[username]", this.state.username);
    formData.append("user[bio]", this.state.bio);
    formData.append("user[id]", this.state.id);
    if ( this.state.imageFile) formData.append("user[image]", this.state.imageFile);

    this.props.updateUser(formData)
      .then(data => this.props.history.push(`/user/${Object.keys(data.user)[0]}`));
  }

  render () {
    let errors = this.props.errors.map((error, i) => <li key={i}>{error}</li>);
    if (!!this.props.user && Object.keys(this.props.user)[0] === this.props.userId) {
      return (
        <form className="user-edit-form">
          <label className="username">Username:
            <input type="text" onChange={this.update('username')} value={this.state.username}/>
          </label>
          <br/>
          <label className="bio">Bio:
            <input type="text" onChange={this.update('bio')} value={this.state.bio}/>
          </label>
          <br/>
          <label className="user-image">Profile Picture
            <input className="image-input" type="file" onChange={this.fileAdd} />
            <img className="user-profile-img" src={this.state.imageUrl} />
          </label>
          <br/>
          <ul className="error-message">
            {errors}
          </ul>
          <button className="input-publish" onClick={this.handleSubmit}>Edit</button>
        </form>
      );
    } else {
      this.props.history.push("/");
      return (<div></div>)

    }
  }
}

export default UserEdit;
