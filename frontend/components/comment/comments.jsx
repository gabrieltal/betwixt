import React from 'react';
import CommentIndexItem from './comment_index_item';
import CommentFormContainer from './comment_form_container';

class Comments extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      storyComments: Object.values(this.props.storyComments)
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.comments !== nextProps.comments) {
      let joined = this.state.storyComments.concat(Object.values(nextProps.comments));
      this.setState({storyComments: joined});
    }
  }

  render () {
    if (!!this.state.storyComments) {
      let comments = this.state.storyComments.map((comment, i) =>
        <CommentIndexItem comment={comment} key={i} />
      );

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
      )
    }
  }
}

export default Comments;
