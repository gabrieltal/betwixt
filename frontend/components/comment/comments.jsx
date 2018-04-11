import React from 'react';
import CommentForm from './comment_form';
import CommentIndexItem from './comment_index_item';
class Comments extends React.Component {
  componentDidMount () {
    this.props.fetchComments();
  }

  render () {
    if (!!this.props.storyComments) {
      const comments = this.props.storyComments.map((comment) =>
        <CommentIndexItem key={comment.id} comment={comment}/>
      );
      return (
        <div className="comments-display">
          <CommentForm story_id={this.props.storyId}
            currentUser={this.props.currentUser}
            openModal={this.props.openModal}
          />
          <ul>
            {comments}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }

  }
}

export default Comments;
