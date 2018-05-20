import { connect } from 'react-redux';
import { searchTaggedStories, receiveErrors } from '../../actions/story_actions';
import StoriesSearch from './stories_search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.searchParams,
    stories: state.stories,
    errors: state.errors.form
  }
};

const mapDispatchToProps = (dispatch) => ({
  searchTaggedStories: (tag) => dispatch(searchTaggedStories(tag)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoriesSearch)
