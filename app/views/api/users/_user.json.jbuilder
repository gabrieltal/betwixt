json.set! user.id do
  json.extract! user, :id, :username
  json.created_at (user.created_at.strftime("%b %Y"))
  json.image_url asset_path(user.image.url)
end
