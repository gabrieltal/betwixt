class Comment < ApplicationRecord
  validates :body, :story, :user, presence: true

  belongs_to :user,
    class_name: :User,
    foreign_key: :author_id

  belongs_to :story,
    class_name: :Story,
    foreign_key: :story_id
end
