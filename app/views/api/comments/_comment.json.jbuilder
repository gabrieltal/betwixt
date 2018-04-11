json.set! comment.id do
  json.extract! comment, :id, :body, :user
  json.story_id comment.story.id
  json.created_at (comment.created_at.strftime("%b %d, %Y"))
end
