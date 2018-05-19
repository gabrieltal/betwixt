import { connect } from 'react-redux';
import { searchTaggedStories, receiveErrors } from '../../actions/story_actions';
import Search from './search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.match.params.searchParams,
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
)(Search)
