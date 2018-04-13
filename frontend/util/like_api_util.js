export const createLike = (like) => (
  $.ajax({
    url: 'api/likes',
    method: 'POST',
    data: {
      like
    }
  })
);

export const deleteLike = (like) => (
  $.ajax({
    url: `api/likes/${like.user_id}/${like.story_id}`,
    method: 'DELETE'
  })
);
