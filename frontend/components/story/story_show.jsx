import React from 'react';
import { Link } from 'react-router-dom';
import UserDetailPaneContainer from '../user/user_detail_pane_container';
import Delta from 'quill-delta';
class StoryShow extends React.Component{
  componentDidMount () {
    this.props.fetchStory(this.props.storyId);
  }

  render () {
    if (!!this.props.story) {
      const story = this.props.story;
      let text = new Delta(JSON.parse(story.body)).map(function(op) {
        debugger;
        if (typeof op.insert === 'string') {
          return op.insert;
        } else {
          return '';
        }
      }).join('');
      debugger;
      return (
        <div className="story-show-container">
        <UserDetailPaneContainer authorId={this.props.story.author_id}/>
          <section className="story-display">
            <h1 className="story-title">{story.title}</h1>
            <p className="story-body">{text}</p>
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
