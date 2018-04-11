import React from 'react';

class CommentForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      author_id: this.props.currentUserId,
      story_id: this.props.storyId
    };
  }

  render () {
    let loggedIn = () => this.props.openModal("comment-login");
    if (!!this.props.currentUser) {
      loggedIn = () => console.log();
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" onClick={loggedIn}/>

        <button>Publish</button>
      </form>
    );
  }
}

export default CommentForm;
