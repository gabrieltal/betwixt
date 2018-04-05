import { connect } from 'react-redux';
import UserShow from './user_show';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  return { userId: ownProps.match.params.userId }
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserShow);
