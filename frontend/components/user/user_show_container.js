import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  const default_user = {username: '', image_url: '', created_at: '', bio: ''}
  return {
    user: state.users[ownProps.match.params.userId] || default_user,
    userId: ownProps.match.params.userId
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
