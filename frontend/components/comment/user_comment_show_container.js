import { connect } from 'react-redux';
import UserComments from './user_comments';
import { selectAuthoredComments } from '../../reducers/selector';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    authoredComments: selectAuthoredComments(state, user),
  }
}

export default connect (
  mapStateToProps, {}
)(UserComments);
