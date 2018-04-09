import { connect } from 'react-redux';
import UserDetailPane from './user_detail_pane';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {

  return {authorId: ownProps.authorId,
  author: state.users[ownProps.authorId]
}
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (authorId) => dispatch(fetchUser(authorId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailPane);
