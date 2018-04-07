import React from 'react';
import StoryIndexItem from '../story/story_index_item';
class UserShow extends React.Component{
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchUser(this.props.userId);
    this.props.fetchStories();
  }
  render () {
    if (!!this.props.user || !!this.props.authoredStories) {
      const user = this.props.user;
      let stories = this.props.authoredStories;
      stories = Object.keys(stories).map((id) => {
        return <StoryIndexItem key={id} story={stories[id]}/>;
      });
      return (
        <div className="user-show">
          <h3>{user.username}</h3>
          <p className="bio">{user.bio}</p>
          <p className="member-creation">Betwixt member since {user.created_at}</p>
          <img className="user-profile-pic" src={user.image_url}/>
          <ul>
            {stories}
          </ul>
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
