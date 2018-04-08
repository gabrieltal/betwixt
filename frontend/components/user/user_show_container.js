import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';
import { fetchStories } from '../../actions/story_actions';
import { selectAuthoredStories } from '../../reducers/selector';

const mapStateToProps = (state, ownProps) => {
  const user = state.users[ownProps.match.params.userId];
  return {
    user,
    userId: ownProps.match.params.userId,
    authoredStories: selectAuthoredStories(state, user)
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id)),
  fetchStories: () => dispatch(fetchStories())
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
