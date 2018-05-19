import { connect } from 'react-redux';
import Search from './search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.searchParams
  }
};

const mapDispatchToProps = (dispatch) => ({
  hi: () => console.log("hi")
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
