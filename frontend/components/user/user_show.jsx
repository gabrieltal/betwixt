import React from 'react';

class UserShow extends React.Component {
  componentDidMount () {
    this.props.fetchUser(this.props.userId);
  }

  render () {
    return (<div>Hello</div>);
  }
}
export default UserShow;
