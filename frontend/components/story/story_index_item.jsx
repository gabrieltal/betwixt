import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import StoryShow from './story_show';
import FollowContainer from '../follow/follow_container';

class StoryIndexItem extends React.Component {
  render () {
    let userControlClassName = "controlsHide";
    const story = this.props.story;
    let title = '';
    let subtitle = '';
    if (!!this.props.currentUser && parseInt(Object.keys(this.props.currentUser)[0]) === story.author_id) {
      userControlClassName = "controlsShow";
    }

    if (story.title) {
      title = story.title.substring(0, 40);
      if (story.title.length !== title.length) {
        title += '...';
      }
    }

    if (story.subtitle) {
      subtitle = `${story.subtitle.substring(0, 140)}`;
      if (story.subtitle.length !== subtitle.length) {
        subtitle += '...';
      }
    }
    return (
      <li className={`story-item-li ${this.props.feature}`}>
        <div className="story-item">
        <Link className="story-title" to={`/story/${story.id}`}>
            {title}
        </Link>
        <br/>
        <Link className="story-preview" to  ={`/story/${story.id}`}>
          <p className="story-show-body">{subtitle}</p>
        </Link>
        <div className="user-follow-container">
          <Link className="author" to={`/user/${story.author_id}`}>
            {story.author}
          </Link>
          <FollowContainer user={story.author_id} />
        </div>

        <p className="create-date">{story.created_at}</p>

        <div className="update-date">
          <div className="arrow-up"></div>
          Updated {story.updated_at}
        </div>


        <div className={userControlClassName}>
          <Link className="edit-link" to={`/story/${story.id}/edit`}>
            Edit Story
          </Link>


          <button className="remove-story"
            onClick={() => this.props.deleteStory(story.id).then(this.props.history.push('/'))}>
            Delete Story
          </button>
          </div>
        </div>
        <Link to={`/story/${story.id}`}>
          <img className="story-header-img" src={story.image_url} />
        </Link>
      </li>
    );
  }
}

export default withRouter(StoryIndexItem);
