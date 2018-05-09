import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';
import { fetchUserStories } from '../../actions/story_actions';
import { fetchUserComments } from '../../actions/comment_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || '',
    errors: state.errors.form,
    userId: ownProps.match.params.userId,
    user: state.users[ownProps.match.params.userId],
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id)),
  fetchUserStories: (authorId) => dispatch(fetchUserStories(authorId)),
  fetchUserComments: (userId) => dispatch(fetchUserComments(userId)),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
