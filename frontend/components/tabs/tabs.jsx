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
      commentsClass -= 'Selected';
      likesClass -= 'Selected';
      component = <UserStoryShowContainer user={this.props.user}/>
    } else if (this.state.selected === "Comments") {
      storiesClass -= 'Selected';
      commentsClass += 'Selected';
      likesClass -= 'Selected';
      component = <UserCommentContainer user={this.props.user}/>
    } else {
      storiesClass -= 'Selected';
      commentsClass -= 'Selected';
      likesClass += 'Selected';
      component = <LikedStoriesContainer user={this.props.user}/>
    }
    return (
      <div className="tabs">
        <nav className="tab-header">
          <button className={storiesClass} onClick={this.selectTab("Stories")}>
            Stories
          </button>
          <button className={commentsClass} onClick={this.selectTab("Comments")}>
            Comments
          </button>
        
        </nav>
        {component}
      </div>
    )
  }
}

export default Tabs;
