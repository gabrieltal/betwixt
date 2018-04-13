import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStory } from '../../actions/story_actions';
import { createLike, deleteLike } from '../../actions/user_actions';
import { openModal, closeModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.match.params.storyId,
    story: state.stories[ownProps.match.params.storyId],
    currentUser: state.session.currentUser
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (storyId) => dispatch(fetchStory(storyId)),
  createLike: (like) => dispatch(createLike(like)),
  deleteLike: (id) => dispatch(deleteLike(id)),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal())
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
