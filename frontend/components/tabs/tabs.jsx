import React from 'react';
import UserStoryShowContainer from '../user/user_story_show_container';
import UserCommentContainer from '../comment/user_comment_show_container';
import LikedStoriesContainer from '../story/liked_stories_container';

class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'Stories'
    }
    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(pane) {
    return e => this.setState({
      selected: pane
    })
  }

  render () {
    let component;
    let storiesClass = 'tab';
    let commentsClass = 'tab';
    let likesClass = 'tab';
    if (this.state.selected === "Stories") {
      storiesClass += 'Selected';
      commentsClass = 'tab';
      likesClass = 'tab';
      component = <UserStoryShowContainer user={this.props.user}/>
    } else if (this.state.selected === "Comments") {
      storiesClass = 'tab';
      commentsClass += 'Selected';
      likesClass = 'tab';
      component = <UserCommentContainer user={this.props.user}/>
    } else {
      storiesClass = 'tab';
      commentsClass = 'tab';
      likesClass += 'Selected';
      component = <LikedStoriesContainer user={this.props.user}/>
    }
    return (
      <aside className="tabs">
        <nav className="tab-header">
          <button className={storiesClass} onClick={this.selectTab("Stories")}>
            Stories
          </button>
          <button className={commentsClass} onClick={this.selectTab("Comments")}>
            Comments
          </button>
          <button className={likesClass} onClick={this.selectTab("Likes")}>
            Likes
          </button>
        </nav>
        {component}
      </aside>
    )
  }
}

export default Tabs;
