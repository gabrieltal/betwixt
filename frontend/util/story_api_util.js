export const fetchStory = (id) => (
  $.ajax({
    url: `api/stories/${id}`,
    method: 'GET'
  })
);

export const fetchStories = () => (
  $.ajax({
    url: 'api/stories',
    method: 'GET'
  })
);

export const createStory = (story) => (
  $.ajax({
    url: 'api/stories',
    method: 'POST',
    data: {
      story
    }
  })
);

export const updateStory = (story) => (
  $.ajax({
    url: `api/stories/${story.id}`,
    method: 'PATCH',
    data: {
      story
    }
  })
);

export const deleteStory = (id) => (
  $.ajax({
    url: `api/stories/${id}`,
    method: 'DELETE'
  })
);
