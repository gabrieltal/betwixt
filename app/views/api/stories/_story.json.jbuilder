json.set! story.id do
  json.extract! story, :id, :author_id, :title, :body, :subtitle
  json.author (story.user.username)
  json.created_at (story.created_at.strftime("%b %d, %Y"))
  json.updated_at (story.updated_at.strftime("%b %d, %Y"))
  json.image_url asset_path(story.image.url)
  json.comments (story.comments.pluck(:id))
  json.likes (story.likes.pluck(:user_id))
  json.tags (story.tags.pluck(:name))
end
