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
    dependent: :destroy,
    class_name: :Comment,
    foreign_key: :story_id

  has_many :likes,
    dependent: :destroy

  has_many :taggings

  has_many :tags, through: :taggings

  def all_tags=(names)
    self.tags = names.split(",").map do |name|
      Tag.where(name: name.strip).first_or_create!
    end
  end

  def all_tags
    self.tags.map(&:name).join(", ")
  end
end
