import React from 'react';
import { Link } from 'react-router-dom';
import UserDetailPaneContainer from '../user/user_detail_pane_container';
import ReactQuill from 'react-quill';
import CommentIndexContainer from '../comment/comment_index_container';

class StoryShow extends React.Component{
  componentDidMount () {
    this.props.fetchStory(this.props.match.params.storyId);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.currentUser !== nextProps.currentUser) {
      this.props.closeModal();
    }
  }

  likeButton () {
    let liked = "sad";
    let ableToLike = () => this.props.openModal("like-login");
    if (!!this.props.currentUser) {
      let userId = parseInt(Object.keys(this.props.currentUser)[0]);
      ableToLike = () => this.props.createLike({user_id: userId, story_id: this.props.story.id});
      if (this.props.story.likes.includes(userId)) {
        liked = "heart";
        ableToLike = () => this.props.deleteLike({user_id: userId, story_id: this.props.story.id});
      }
    }
      return (
        <aside className="like-container">
        <span className={liked} onClick={ableToLike}></span>
        <p>{this.props.story.likes.length}</p>
        </aside>
      );
    }

  render () {
    if (!!this.props.story) {
      const story = this.props.story;
      let tags = this.props.story.tags;
      tags = tags.map((tag, i) =>
        (<li key={i}>
          <Link to={`/search/${tag}`} className="tagLink">{tag}</Link>
        </li>)
      )
      return (
        <div className="story-show-container">
        <UserDetailPaneContainer authorId={this.props.story.author_id}/>
          <section className="story-display">
            <h1 className="story-title">{story.title}</h1>
            <h3 className="story-subtitle">{story.subtitle}</h3>
            <img className="story-header-img" src={story.image_url}/>
            <div className="story-show-body" dangerouslySetInnerHTML={{__html: story.body}}/>
            <div className="separator"></div>
            <ul className="tag-list">
            {tags}
            </ul>
            <div className="story-accessories">
              {this.likeButton()}
              <p className="story-date">Created on {story.created_at}
              <span className="update-date"><span className="arrow-up"></span>Updated {story.updated_at}</span>
              </p>
            </div>
          </section>
          <CommentIndexContainer story={story}/>
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
