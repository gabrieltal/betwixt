class User < ApplicationRecord
  validates :username, :password_digest, :session_token, presence: true
  validates :session_token, :username, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  has_attached_file :image, default_url: "default.jpg",
    :s3_host_name => "s3.us-west-1.amazonaws.com",
    :url => ":s3_host_name",
    :path => '/:class/:attachment/:id_partition/:style/:filename'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  has_many :likes,
    dependent: :destroy

  has_many :followers,
    class_name: :Follow,
    foreign_key: :following_id

  has_many :following,
    class_name: :Follow,
    foreign_key: :follower_id

  has_many :stories,
    dependent: :destroy,
    class_name: :Story,
    foreign_key: :author_id

  has_many :comments,
    dependent: :destroy,
    class_name: :Comment,
    foreign_key: :author_id

  attr_reader :password
  after_initialize :ensure_session_token

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64
    self.save!
    self.session_token
  end

  def self.containing(tag)
    User.where(["username ILIKE ?", "%#{tag}%"])
  end

  private
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64
  end
end
