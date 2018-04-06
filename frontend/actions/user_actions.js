import * as ApiUser from '../util/user_api_util';
export const RECEIVE_USER = "RECEIVE_USER";

export const fetchUser = (id) => (dispatch) => (
  ApiUser.fetchUser(id).then((user) => dispatch(receiveUser(user)))
);

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});
