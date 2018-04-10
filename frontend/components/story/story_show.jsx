import React from 'react';
import { Link } from 'react-router-dom';
import UserDetailPaneContainer from '../user/user_detail_pane_container';
import ReactQuill from 'react-quill';
class StoryShow extends React.Component{
  componentDidMount () {
    this.props.fetchStory(this.props.storyId);
  }

  render () {
    if (!!this.props.story) {
      const story = this.props.story;
      debugger;
      return (
        <div className="story-show-container">
        <UserDetailPaneContainer authorId={this.props.story.author_id}/>
          <section className="story-display">
            <img className="story-header-img" src={story.image_url}/>
            <h1 className="story-title">{story.title}</h1>
            <div className="story-show-body" dangerouslySetInnerHTML={{__html: story.body}}/>

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
