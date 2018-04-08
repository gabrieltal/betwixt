import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="story-show-container">
          <aside className="author-display">
            <Link to={`/user/${author.id}`}>
              <img className="user-profile-pic" src={author.image_url}/>
            </Link>
              <div className="user-details">
                <Link to={`/user/${author.id}`}><h3>{author.username}</h3></Link>
                <p className="bio">{author.bio}</p>
                <p className="member-creation">{author.created_at}</p>
              </div>
          </aside>
          <section className="story-display">
            <h1 className="story-title">{story.title}</h1>
            <p className="story-body">{story.body}</p>
            <p className="story-date">Created on {story.created_at}</p>
            <div className="update-date"><div className="arrow-up"></div>Updated {story.updated_at}</div>
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
