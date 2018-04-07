import React from 'react';

class StoryShow extends React.Component{
  render () {
    if (!!this.props.story) {
      const story = this.props.story;
      return (
        <div>
          <h1>{story.title}</h1>
          <h3>{story.author}</h3>
          <p>{story.body}</p>
          <p>{story.created_at}</p>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default StoryShow;
