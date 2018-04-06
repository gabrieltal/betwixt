import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  const default_user = { id: '0', username: 'no_one', image_url: ''};
  const user = state.users[ownProps.match.params.userId] || default_user;
  console.log(user);
  return {
    user: user,
    userId: ownProps.match.params.userId
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
