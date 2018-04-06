class Story < ApplicationRecord
  validates :body, :title, :user, presence: true

  belongs_to :user,
    class_name: :User,
    foreign_key: :author_id

end
