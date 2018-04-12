import React from 'react';
import { Link } from 'react-router-dom';
class CommentIndexItem extends React.Component{
  render () {
    const author = this.props.comment.author;
    const comment = this.props.comment;
    return (
      <li className="comment-item">
        <div className="author-info">
          <Link to={`/users/${author.id}`}>
            <img src={author.image}/>
          </Link>
          <div className="text-info">
            <Link to={`/users/${author.id}`}>
              <h3>{author.name}</h3>
            </Link>
            <p>{comment.created_at}</p>
          </div>
        </div>
        <div className="comment-body" dangerouslySetInnerHTML={{__html: comment.body}}/>
        
      </li>
    );
  }
}

export default CommentIndexItem;
