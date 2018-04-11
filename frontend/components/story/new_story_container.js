import { connect } from 'react-redux';
import StoryForm from './story_form';
import { createStory, receiveErrors } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  const story = { id: '', title: '', author_id: '', body: ''}
  return {
    story,
    errors: state.errors.form,
    authorId: Object.keys(state.session.currentUser)[0],
   }
};

const mapDispatchToProps = dispatch => ({
  action: (story) => dispatch(createStory(story)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryForm);
