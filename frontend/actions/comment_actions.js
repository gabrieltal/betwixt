import * as ApiComment from '../util/comment_api_util';
export const RECEIVE_COMMENT = "RECEIVE_COMMENT";
export const RECEIVE_COMMENTS = "RECEIVE_COMMENTS";
export const REMOVE_COMMENT = "REMOVE_COMMENT";
export const RECEIVE_FORM_ERRORS = "RECEIVE_FORM_ERRORS";

export const fetchComment = (id) => (dispatch) => (
  ApiComment.fetchComment(id).then((comment) => dispatch(receiveComment(comment)))
);

export const fetchComments = () => (dispatch) => (
  ApiComment.fetchComments().then((comments) => dispatch(receiveComments(comments)))
);

export const createComment = (comment) => (dispatch) => (
  ApiComment.createComment(comment).then((comment) => dispatch(receiveComment(comment)),
  (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const updateComment = (comment) => (dispatch) => (
  ApiComment.updateComment(comment).then((comment) => dispatch(receiveComment(comment)),
    (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const deleteStory = (commentId) => (dispatch) => (
  ApiComment.deleteStory(commentId).then((comment) => dispatch(removeComment(comment.id)))
);

const removeComment = (commentId) => ({
  type: REMOVE_COMMENT,
  commentId
});

const receiveComments = (comments) => ({
  type: RECEIVE_COMMENTS,
  comments
});

const receiveComment = (comment) => ({
  type: RECEIVE_COMMENT,
  comment
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_FORM_ERRORS,
  errors
});
