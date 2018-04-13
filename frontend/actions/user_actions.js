import * as ApiUser from '../util/user_api_util';
import * as ApiLike from '../util/like_api_util';

export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_USER_FORM_ERRORS = "RECEIVE_USER_FORM_ERRORS";
export const RECEIVE_LIKE = "RECEIVE_LIKE";
export const REMOVE_LIKE = "REMOVE_LIKE";

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
    (errors) => dispatch(receiveErrors(errors.responseJSON))
));

export const createLike = like => dispatch => (
  ApiLike.createLike(like).then(like => dispatch(receiveLike(like)))
);

export const receiveLike = (like) => ({
  type: RECEIVE_LIKE,
  like
});

export const deleteLike = ({user_id, story_id}) => dispatch => (
  ApiLike.deleteLike({user_id, story_id}).then(like => dispatch(removeLike(like)))
);

export const removeLike = (like) => ({
  type: REMOVE_LIKE,
  like
});
