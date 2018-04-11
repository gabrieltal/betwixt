import React from 'react';
import CommentIndexItem from './comment_index_item';
import CommentFormContainer from './comment_form_container';

class Comments extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    if (!!this.props.storyComments) {
      let comments = this.props.storyComments.map((comment) => {
        if (typeof comment !== "undefined") {
          return <CommentIndexItem comment={comment} key={comment.id}/>;
        }
      });
      return (
        <div className="comments-container">
          <CommentFormContainer storyId={this.props.storyId} />
          <ul className="comments-list">
            {comments}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      );
    }
  }
}

export default Comments;
