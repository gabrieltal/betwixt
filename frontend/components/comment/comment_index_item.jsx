import React from 'react';

class CommentIndexItem extends React.Component{
  render () {
    return (
      <li>
        {this.props.comment.body}
      </li>
    );
  };
}

export default CommentIndexItem;
