import React from 'react';

class UserShow extends React.Component{
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchUser(this.props.userId)
  }
  render () {
    if (!!this.props.user) {
      const user = this.props.user;
      return (
        <div className="user-show">
          <h3>{user.username}</h3>
          <p className="bio">{user.bio}</p>
          <p className="member-creation">Betwixt member since {user.created_at}</p>
          <img className="user-profile-pic" src={user.image_url}/>
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
