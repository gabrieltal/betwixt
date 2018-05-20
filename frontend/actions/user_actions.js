import * as ApiUser from '../util/user_api_util';
import * as ApiLike from '../util/like_api_util';
import * as ApiFollow from '../util/follow_api_util';

export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_USER_FORM_ERRORS = "RECEIVE_USER_FORM_ERRORS";
export const RECEIVE_LIKE = "RECEIVE_LIKE";
export const REMOVE_LIKE = "REMOVE_LIKE";
export const RECEIVE_FOLLOW = "RECEIVE_FOLLOW";
export const REMOVE_FOLLOW = "REMOVE_FOLLOW";
export const RECEIVE_USERS = "RECEIVE_USERS";

export const fetchUser = (id) => (dispatch) => (
  ApiUser.fetchUser(id).then((user) => dispatch(receiveUser(user)))
);

export const updateUser = (user) => (dispatch) => (
  ApiUser.updateUser(user).then((user) => dispatch(receiveUser(user)),
  (errors) => dispatch(receiveErrors(errors.responseJSON))
));

export const searchTaggedUsers = (tag) => (dispatch) => (
  ApiUser.searchTaggedUsers(tag).then((users) => dispatch(receiveUsers(users)),
  (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

const receiveUsers = (users) => ({
  type: RECEIVE_USERS,
  users
});

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_USER_FORM_ERRORS,
  errors
});


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

export const createFollow = (follow) => (dispatch) => (
  ApiFollow.createFollow(follow).then(follow => dispatch(receiveFollow(follow)))
);

export const deleteFollow = ({follower_id, following_id}) => (dispatch) => (
  ApiFollow.deleteFollow({follower_id, following_id}).then(follow => dispatch(removeFollow(follow)))
);

const receiveFollow = (follow) => ({
  type: RECEIVE_FOLLOW,
  follow
});

const removeFollow = (follow) => ({
  type: REMOVE_FOLLOW,
  follow
});
