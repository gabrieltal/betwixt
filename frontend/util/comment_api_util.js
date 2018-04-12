export const fetchComments = (storyId) => (
  $.ajax({
    url: `api/stories/${storyId}/comments`,
    method: 'GET',
  })
);

export const createComment = (comment) => (
  $.ajax({
      url: `api/comments`,
      method: 'POST',
      data: {
        comment
      }
  })
);

export const deleteComment = (comment) => (
  $.ajax({
    url: `api/comments/${comment.id}`,
    method: 'DELETE'
  })
);
