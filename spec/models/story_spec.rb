require 'rails_helper'

RSpec.describe Story, type: :model do

  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:body) }
  it { should validate_presence_of(:user) }

  it { should belong_to(:user) }
  it { should have_many(:taggings) }
  it { should have_many(:tags) }
  it { should have_many(:likes) }
  it { should have_many(:comments) }
end
