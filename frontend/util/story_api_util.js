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
