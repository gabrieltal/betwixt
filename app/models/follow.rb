class Follow < ApplicationRecord
  validates :follower_id, uniqueness: { scope: :following_id }
  has_many :followers,
    class_name: :User,
    foreign_key: :follower_id

  has_many :following,
    class_name: :User,
    foreign_key: :following_id
end
