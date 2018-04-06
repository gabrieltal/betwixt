import React from 'react';

class StoryIndexItem extends React.Component {

  render () {
    const story = this.props.story;
    return (
      <li className="story-item">
        <h3>{story.title}</h3>
        <p>{story.body.substring(0,140)}</p>
        <p>{story.created_at}</p>
        <p>{story.author}</p>
      </li>
    );
  }
}

export default StoryIndexItem;
