import React from 'react';
import { Link } from 'react-router-dom';
import StoryShow from './story_show';
class StoryIndexItem extends React.Component {

  render () {
    const story = this.props.story;
    return (
      <li className="story-item">
        <Link className="story-title" to={`/story/${story.id}`}>{story.title}</Link>
        <p className="story-preview">{story.body.substring(0,140)}...</p>
        <Link className="author" to={`/user/${story.author_id}`}>
          {story.author}
        </Link>
        <p className="create-date">{story.created_at}</p>
        <p className="update-date">{story.updated_at}</p>
      </li>
    );
  }
}

export default StoryIndexItem;
