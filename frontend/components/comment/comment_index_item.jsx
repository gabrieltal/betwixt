import React from 'react';
import { Link } from 'react-router-dom';
class CommentIndexItem extends React.Component{
  render () {
    const comment = this.props.comment;
    const user = this.props.comment.user;
    return (
      <li>
        <div className="user-info">
          <img src={user.image_url} />
          <Link to={`/user/${user.id}`}>
            <p className='username'>{user.username}</p>
          </Link>
        </div>

        <div className="comment-show-body" dangerouslySetInnerHTML={{__html: comment.body}}/>

      </li>
    );
  }
}

export default CommentIndexItem;
