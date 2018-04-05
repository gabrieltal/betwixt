import { connect } from 'react-redux';
import Nav from './nav';
import { logout } from '../../actions/session_actions';
import { openModal } from '../../actions/modal_actions';
import { login } from '../../actions/session_actions';

const mapStateToProps = (state) => {
  return { currentUser: state.session.currentUser };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  openModal: modal => dispatch(openModal(modal)),
  login: (user) => dispatch(login(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
