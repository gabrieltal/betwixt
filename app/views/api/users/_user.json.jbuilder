json.set! user.id do
  json.extract! user, :id, :username, :bio
  json.authoredStories (user.stories.pluck(:id))
  json.created_at (user.created_at.strftime("%b %Y"))
  json.image_url asset_path(user.image.url)
  json.comments (user.comments.pluck(:id))
  json.likes (user.likes.pluck(:id))
end
