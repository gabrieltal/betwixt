class Story < ApplicationRecord
  validates :body, :title, :user, presence: true

  has_attached_file :image, default_url: "default.jpg",
    :s3_host_name => "s3.us-west-1.amazonaws.com",
    :url => ":s3_host_name",
    :path => '/:class/:attachment/:id_partition/:style/:filename'

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :user,
    class_name: :User,
    foreign_key: :author_id

  has_many :comments,
    class_name: :Comment,
    foreign_key: :story_id

  has_many :likes

end
