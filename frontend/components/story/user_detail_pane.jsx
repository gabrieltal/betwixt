import React from 'react';
import { Link } from 'react-router-dom';
class UserDetailPane extends React.Component {
  componentDidMount() {
    this.props.fetchUser(this.props.authorId);
  }

  render () {
    if (!!this.props.author) {
      const author = this.props.author;
      return (
        <aside className="author-display">
          <Link to={`/user/${author.id}`}>
            <img className="user-profile-pic" src={author.image_url}/>
          </Link>
          <div className="user-details">
            <Link to={`/user/${author.id}`}><h3>{author.username}</h3></Link>
            <p className="bio">{author.bio}</p>
            <p className="member-creation">{author.created_at}</p>
          </div>
        </aside>
      );
    } else {
      return (<div>Loading...</div>);
    }
  }
}

export default UserDetailPane;
