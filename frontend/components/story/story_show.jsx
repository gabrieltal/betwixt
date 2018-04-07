import React from 'react';

class StoryShow extends React.Component{
  componentDidMount () {
    this.props.fetchStory(this.props.storyId);
  }

  render () {
    if (!!this.props.story) {
      const story = this.props.story;
      return (
        <section className="story-show-container">
          <h1 className="story-title">{story.title}</h1>
          <h3 className="story-author">{story.author}</h3>
          <p className="story-body">{story.body}</p>
          <p className="story-create-date">{story.created_at}</p>
        </section>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default StoryShow;
