import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStories, fetchStory } from '../../actions/story_actions';


const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.match.params.storyId,
    story: state.stories[ownProps.match.params.storyId]
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (id) => dispatch(fetchStory(id)),
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
