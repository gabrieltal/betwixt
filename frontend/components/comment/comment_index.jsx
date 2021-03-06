import React from 'react';
import CommentIndexItem from './comment_index_item';
import CommentFormContainer from './comment_form_container';

class CommentIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      storyComments: this.props.storyComments
    }
  }

  componentDidMount () {
    this.props.fetchComments(this.props.storyId);
  }

  render () {
    if (!!this.props.storyComments) {
        let comments = Object.values(this.props.storyComments).map(comment =>
          <CommentIndexItem key={comment.id} comment={comment}/>
        );
      return (
        <div className="comments-container">
          <h3>Responses</h3>
          <CommentFormContainer storyId={this.props.storyId} />
          <ul className="comments-list">
            {comments}
          </ul>
        </div>
      );
  } else {
    return (<div> Loading...</div>);
  }
}
}

export default CommentIndex;
