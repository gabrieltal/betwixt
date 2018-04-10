import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import StoryShow from './story_show';

class StoryIndexItem extends React.Component {
  render () {
    let userControlClassName = "controlsHide";
    const story = this.props.story;
    if (!!this.props.currentUser && parseInt(Object.keys(this.props.currentUser)[0]) === story.author_id) {
      userControlClassName = "controlsShow";
    }
    return (
      <li className="story-item-li">
        <div className="story-item">
        <Link className="story-title" to={`/story/${story.id}`}>
            {story.title}
        </Link>
        <br/>
        <Link className="story-preview" to  ={`/story/${story.id}`}>
        <div className="story-show-body" dangerouslySetInnerHTML={{__html: story.body.substring(0,140)}}/>

        </Link>
        <br/>
        <Link className="author" to={`/user/${story.author_id}`}>
          {story.author}
        </Link>
        <br/>
        <p className="create-date">{story.created_at}</p>

        <div className="update-date">
          <div className="arrow-up"></div>
          Updated {story.updated_at}
        </div>

        <div className={userControlClassName}>
          <Link className="edit-link" to={`/story/${story.id}/edit`}>
            Edit Story
          </Link>
          <button onClick={() => this.props.deleteStory(story.id).then(this.props.history.push('/'))}>
            Delete Story
          </button>
        </div>
        </div>
        <img className="story-header-img" src={story.image_url} />

      </li>
    );
  }
}

export default withRouter(StoryIndexItem);
