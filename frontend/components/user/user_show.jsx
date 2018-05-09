import React from 'react';
import UserStoryShowContainer from './user_story_show_container';
import { Link } from 'react-router-dom';
import FollowContainer from '../follow/follow_container';
import Tabs from '../tabs/tabs.jsx';
class UserShow extends React.Component{
  componentDidMount() {
    this.props.fetchUser(this.props.match.params.userId);
    this.props.fetchUserStories(this.props.match.params.userId);
    this.props.fetchUserComments(this.props.match.params.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      this.props.fetchUser(nextProps.match.params.userId);
    }
  }

  render () {
    if (!!this.props.user) {
      const user = this.props.user;
      const canEdit = parseInt(Object.keys(this.props.currentUser)[0]) === user.id ? "edit-link" : "cannot-edit";
      return (
        <div className="user-show-container">
          <div className="user-header-info">
            <img className="user-profile-pic" src={user.image_url}/>
            <div className="user-details">
              <h3>{user.username}</h3>
              <p className="bio">{user.bio}</p>
              <p className="member-creation">Betwixt member since {user.created_at}</p>
              <Link className={canEdit} to={`/user/${user.id}/edit`}>
                Edit Profile
              </Link>
              <FollowContainer user={user.id}/>
              <div className="following-info">
                <p>{user.followers.length} Followers</p>
                <p>{user.following.length} Following</p>
              </div>
            </div>
          </div>
          <Tabs user={user}/>
        </div>
      );
    } else {
      return (
        <div> Loading...</div>
      );
    }
  }
}
export default UserShow;
