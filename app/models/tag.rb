class Tag < ApplicationRecord
  has_many :taggings
  has_many :stories, through: :taggings
end
