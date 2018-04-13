import { connect } from 'react-redux';
import StoryIndex from './story_index';
import { fetchStories } from '../../actions/story_actions';
import { getFollowingStoriesFirst } from '../../reducers/selector';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    currentUser: state.session.currentUser,
    storiesList: getFollowingStoriesFirst(state, state.session.currentUser)
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStories: () => dispatch(fetchStories()),
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryIndex);
