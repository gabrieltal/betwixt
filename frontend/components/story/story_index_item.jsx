import React from 'react';
import { Link } from 'react-router-dom';
import StoryShow from './story_show';

class StoryIndexItem extends React.Component {
  render () {
    let editClassName = "editHide";
    const story = this.props.story;
    if (!!this.props.currentUser && parseInt(Object.keys(this.props.currentUser)[0]) === story.author_id) {
      editClassName = "editShow";
    }
    return (
      <li className="story-item">
        <Link className="story-title" to={`/story/${story.id}`}>
          {story.title}
        </Link>
        <br/>
        <Link className="story-preview" to={`/story/${story.id}`}>
          {story.body.substring(0,140)}...
        </Link>
        <br/>
        <Link className="author" to={`/user/${story.author_id}`}>
          {story.author}
        </Link>
        <p className="create-date">{story.created_at}</p>

        <div className="update-date"><div className="arrow-up"></div>Updated {story.updated_at}</div>
        <Link className={editClassName} to={`/story/${story.id}/edit`}>Edit</Link>
      </li>
    );
  }
}

export default StoryIndexItem;
