import { connect } from 'react-redux';
import StoryForm from './story_form';
import { createStory } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors,
    authorId: Object.keys(state.session.currentUser)[0],
   }
};

const mapDispatchToProps = dispatch => ({
  createStory: (story) => dispatch(createStory(story))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryForm);
