class Like < ApplicationRecord
  validates :user_id, uniqueness: { scope: :story_id }
  belongs_to :story
  belongs_to :user
end
