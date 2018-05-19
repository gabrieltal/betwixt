export const fetchStory = (id) => (
  $.ajax({
    url: `api/stories/${id}`,
    method: 'GET'
  })
);

export const searchTaggedStories = (tag) => (
  $.ajax({
    url: `api/tags/${tag}`,
    method: 'GET'
  })
)

export const fetchLikedStories = (userId) => (
  $.ajax({
    url: `api/users/${userId}/likes`,
    method: 'GET'
  })
)

export const fetchUserStories = (authorId) => (
  $.ajax({
    url: `api/stories/from/${authorId}`,
    method: 'GET',
  })
);

export const fetchStories = () => (
  $.ajax({
    url: 'api/stories',
    method: 'GET'
  })
);

export const createStory = (formData) => (
  $.ajax({
    url: 'api/stories',
    method: 'POST',
    dataType: 'json',
    contentType: false,
    processData: false,
    data: formData
  })
);

export const updateStory = (formData) => (
  $.ajax({
    url: `api/stories/${formData.get("story[id]")}`,
    method: 'PATCH',
    dataType: 'json',
    contentType: false,
    processData: false,
    data: formData
  })
);

export const deleteStory = (id) => (
  $.ajax({
    url: `api/stories/${id}`,
    method: 'DELETE'
  })
);
