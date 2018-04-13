import { connect } from 'react-redux';
import StoryIndex from './story_index';
import { fetchStories } from '../../actions/story_actions';
import { getFollowingStoriesFirst } from '../../reducers/selector';

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    currentUser: state.session.currentUser,
    storiesList: getFollowingStoriesFirst(state, state.session.currentUser)
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStories: () => dispatch(fetchStories())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryIndex);
