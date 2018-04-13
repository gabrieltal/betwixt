export const createFollow = (follow) => (
  $.ajax({
    url: 'api/follows',
    method: 'POST',
    data: {
      follow
    }
  })
);

export const deleteFollow = (follow) => (
  $.ajax({
    url: `api/follows/${follow.follower_id}/${follow.following_id}`,
    method: 'DELETE'
  })
);
