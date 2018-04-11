import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStory } from '../../actions/story_actions';
import { fetchComments } from '../../actions/comment_actions';
const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.match.params.storyId,
    story: state.stories[ownProps.match.params.storyId],
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (storyId) => dispatch(fetchStory(storyId)),
  fetchComments: () => dispatch(fetchComments())
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
