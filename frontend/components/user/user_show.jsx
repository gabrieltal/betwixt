import React from 'react';

class UserShow extends React.Component{
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchUser(this.props.userId)
  }
  render () {
    const user = this.props.user;
    return (
      <div className="user-show">
        <h3>{user.username}</h3>
        <p>Betwixt member since {user.created_at}</p>
        <p>{user.bio}</p>
        <img className="user-profile-pic" src={user.image_url}/>
      </div>
    );
  }
}
export default UserShow;
