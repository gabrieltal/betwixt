json.set! comment.id do
  json.extract! comment, :body
  json.author comment.user.username
  json.created_at (comment.created_at.strftime("b %d, %Y"))
end
