import React from 'react';

class Follow extends React.Component {
  render () {
    let following = "Follow";
    let ableOrAlreadyFollow = () => this.props.openModal("follow-login");
    if (!!this.props.currentUser) {
      let user = this.props.user;
      let currentUser = Object.values(this.props.currentUser)[0];
      ableOrAlreadyFollow = () => this.props.createFollow({follower_id: currentUser.id, following_id: user.id });
      if (user.followers.includes(currentUser.id)) {
        following = "Following";
        ableOrAlreadyFollow = () => this.props.deleteFollow({follower_id: currentUser.id, following_id: user.id});
      }
    }
    return (
      <div className="follow-container">
        <button className={following} onClick={ableOrAlreadyFollow}>{following}</button>
      </div>
    )
  }
}

export default Follow;
