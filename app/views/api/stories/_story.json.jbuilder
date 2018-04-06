json.set! story.id do
  json.extract! story, :id, :author_id, :title, :body
  json.author (story.user.username)
  json.created_at (story.created_at.strftime("%b %d,%Y"))
end
