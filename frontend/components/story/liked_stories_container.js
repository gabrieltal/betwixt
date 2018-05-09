import { connect } from 'react-redux';
import LikedStories from './liked_stories';
import { selectLikedStories } from '../../reducers/selector';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    likedStories: selectLikedStories(state, user)
  }
}

export default connect(
  mapStateToProps, {}
)(LikedStories);
