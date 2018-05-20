import { connect } from 'react-redux';
import { searchTaggedUsers, receiveErrors } from '../../actions/user_actions';
import UsersSearch from './users_search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.searchParams,
    users: state.users,
    errors: state.errors.form
  }
};

const mapDispatchToProps = (dispatch) => ({
  searchTaggedUsers: (tag) => dispatch(searchTaggedUsers(tag)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersSearch)
