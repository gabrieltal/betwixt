import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStories, fetchStory } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  return { story: state.stories[ownProps.match.params.storyId] };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStories: () => dispatch(fetchStories()),
  fetchStory: (id) => dispatch(fetchStory(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
