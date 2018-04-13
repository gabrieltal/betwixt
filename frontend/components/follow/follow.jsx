import React from 'react';

class Follow extends React.Component {
  render () {
    let following = "Follow";
    let ableOrAlreadyFollow = () => this.props.openModal("follow-login");
    if (!!this.props.currentUser) {
      let userId = this.props.userId;
      let currentUser = Object.values(this.props.currentUser)[0];
      ableOrAlreadyFollow = () => this.props.createFollow({follower_id: currentUser.id, following_id: userId });
      if (currentUser.following.includes(userId)) {
        following = "Following";
        ableOrAlreadyFollow = () => this.props.deleteFollow({follower_id: currentUser.id, following_id: userId});
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
