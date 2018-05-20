import React from 'react';
import { Link } from 'react-router-dom';
import FollowContainer from '../follow/follow_container';

class UserDetailPane extends React.Component {
  componentDidMount() {
    if (Object.keys(this.props.author).length === 0) {
      this.props.fetchUser(this.props.authorId);
    }
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
            <div className="user-name-follow">
              <Link to={`/user/${author.id}`}><h3>{author.username}</h3></Link>
              <FollowContainer user={author.id}/>
            </div>
            <p className="bio">{author.bio}</p>
            <p className="member-creation">Betwixt member since {author.created_at}</p>
          </div>
        </aside>
      );
    } else {
      return (<div>Loading...</div>);
    }
  }
}

export default UserDetailPane;
