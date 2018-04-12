export const fetchUser = (id) => (
  $.ajax({
    url: `api/users/${id}`,
    method: 'GET'
  })
);

export const updateUser = (formData) => (
  $.ajax({
    url: `api/users/${formData.get("user[id]")}`,
    method: 'PATCH',
    dataType: 'json',
    contentType: false,
    processData: false,
    data: formData
  })
);
