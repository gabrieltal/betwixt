import { connect } from 'react-redux';
import Comments from './comments';
import { selectStoryComments } from '../../reducers/selector';

const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.story.id,
    story: ownProps.story,
    currentUser: state.session.currentUser,
    storyComments: selectStoryComments(state, ownProps.story)
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComment: (id) => dispatch(fetchComment(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
