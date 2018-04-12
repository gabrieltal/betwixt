json.set! comment.id do
  json.extract! comment, :id, :body
  json.story_id comment.story.id
  json.created_at (comment.created_at.strftime("%b %d, %Y"))
  json.author do
    json.id comment.user.id
    json.name comment.user.username
    json.image asset_path(comment.user.image.url)
  end
end
