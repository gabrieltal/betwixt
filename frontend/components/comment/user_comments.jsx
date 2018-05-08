import React from 'react';
import StorySpecifiedCommentIndexItem from './story_specified_comment_index_item';

class UserComments extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    if (this.props.authoredComments.length > 0) {
      let comments = this.props.authoredComments;

      comments = comments.map((comment) => {
        if (typeof comment !== 'undefined') {
          return <StorySpecifiedCommentIndexItem key={comment.id}
            comment={comment} />
        }
      });
      return (
        <div className="comments-container">
          <ul className='comments-list'>
            {comments}
          </ul>
        </div>
      );
    } else {
      return (<div> </div>)
    }
  }
}

export default UserComments;
