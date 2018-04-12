import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStory } from '../../actions/story_actions';


const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.match.params.storyId,
    story: state.stories[ownProps.match.params.storyId],
    currentUser: state.session.currentUser
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (storyId) => dispatch(fetchStory(storyId))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
