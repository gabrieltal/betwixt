@stories.each do |story|
  json.partial! 'api/stories/story', story: story
end
