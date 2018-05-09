import { connect } from 'react-redux';
import LikedStories from './liked_stories';
import { selectLikedStories } from '../../reducers/selector';
import { fetchLikedStories } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    likedStories: selectLikedStories(state, user)
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchLikedStories: (userId) => dispatch(fetchLikedStories(userId))
})

export default connect(
  mapStateToProps, mapDispatchToProps
)(LikedStories);
