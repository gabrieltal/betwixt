import { connect } from 'react-redux';
import { receiveErrors } from '../../actions/story_actions';
import Search from './search';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.match.params.searchParams,
    errors: state.errors.form,
  }
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
