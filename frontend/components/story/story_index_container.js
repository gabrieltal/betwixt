import { connect } from 'react-redux';
import StoryIndex from './story_index';
import { fetchStories } from '../../actions/story_actions';

const mapStateToProps = (state) => {
  return { stories: state.stories };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStories: () => dispatch(fetchStories())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryIndex);
