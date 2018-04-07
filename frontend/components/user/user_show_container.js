import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';
import { selectAuthoredStories } from '../../reducers/selector'
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.users[ownProps.match.params.userId],
    userId: ownProps.match.params.userId
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
