import React from 'react';

class StoryShow extends React.Component{
  componentDidMount () {
    this.props.fetchStory(this.props.storyId);
    this.props.fetchUser(this.props.authorId);
  }

  render () {
    if (!!this.props.story && !!this.props.author) {
      const story = this.props.story;
      const author = this.props.author
      return (
        <div>
          <aside>
            
          </aside>
          <section className="story-show-container">
            <h1 className="story-title">{story.title}</h1>
            <h3 className="story-author">{author.username}</h3>
            <p className="story-body">{story.body}</p>
            <p className="story-create-date">{story.created_at}</p>
          </section>
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
