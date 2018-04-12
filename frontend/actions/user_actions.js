import * as ApiUser from '../util/user_api_util';
export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_USER_FORM_ERRORS = "RECEIVE_USER_FORM_ERRORS";

export const fetchUser = (id) => (dispatch) => (
  ApiUser.fetchUser(id).then((user) => dispatch(receiveUser(user)))
);

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_USER_FORM_ERRORS,
  errors
});

export const updateUser = (user) => (dispatch) => (
  ApiUser.updateUser(user).then((user) => dispatch(receiveUser(user)),
    (errors) => dispatch(receiveErrors(errors.repsonseJSON))
));
