import React from 'react';
import StoryIndexItem from '../story/story_index_item';
import UserStoryShowContainer from './user_story_show_container';

class UserShow extends React.Component{
  componentDidMount() {
    this.props.fetchUser(this.props.userId);
    this.props.fetchStories();
  }

  render () {
    if (!!this.props.user) {
      const user = this.props.user;
      return (
        <div className="user-show-container">
          <div className="user-header-info">
            <img className="user-profile-pic" src={user.image_url}/>
            <div className="user-details">
              <h3>{user.username}</h3>
              <p className="bio">{user.bio}</p>
              <p className="member-creation">Betwixt member since {user.created_at}</p>
            </div>
          </div>
          <UserStoryShowContainer user={user} authoredStories={this.props.authoredStories}/>
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
