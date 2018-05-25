require 'rails_helper'

RSpec.describe Follow, type: :model do

  describe 'Following' do
    follower = User.find_by_username('gabrielt');
    following = User.find_by_username('gabriel');

    follow = Follow.create({
      follower_id: follower.id,
      following_id: following.id
    })

    it 'creates a follow' do
      expect(follow).to_not be_nil
    end

    it 'removes a follow' do
      follow = Follow.all.last
      follow.destroy
      expect(Follow.all.last).to_not be(follow)
    end
  end
end
