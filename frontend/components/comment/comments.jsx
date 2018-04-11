import React from 'react';
import CommentFormContainer from './comment_form_container';
import CommentIndexItem from './comment_index_item';

class Comments extends React.Component {

  render () {
    if (!!this.props.storyComments) {
      const comments = this.props.storyComments.map((comment) =>
        <CommentIndexItem key={comment.id} comment={comment}/>
      );

      return (
        <div className="comments-display">
          <CommentFormContainer storyId={this.props.storyId} />
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
