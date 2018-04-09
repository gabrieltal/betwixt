import * as ApiSession from '../util/session_api_util';
export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";

export const login = (userForm) => (dispatch) => (
  ApiSession.login(userForm).then((user) => dispatch(receiveCurrentUser(user)),
   (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const logout = () => (dispatch) => (
  ApiSession.logout().then(() => dispatch(receiveCurrentUser(null)),
    (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const signup = (userForm) => (dispatch) => (
  ApiSession.signup(userForm).then((user) => dispatch(receiveCurrentUser(user)),
    (errors) => dispatch(receiveErrors(errors.responseJSON)))
);


const receiveCurrentUser = (currentUser) => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});
