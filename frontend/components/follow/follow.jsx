import React from 'react';

class Follow extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.createFollow({follower_id: 4, following_id: 1});
  }

  render () {
    return (
      <div className="follow-container">
        <button onClick={this.handleSubmit}>Follow</button>
      </div>
    )
  }
}

export default Follow;
