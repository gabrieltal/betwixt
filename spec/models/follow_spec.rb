require 'rails_helper'

RSpec.describe Follow, type: :model do

  describe 'Following' do
    follower = User.create({username: 'pizzamaster2001', password: 'password'});
    following = User.create({username: 'gabrieltal123', password: 'password'});

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
