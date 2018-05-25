require 'rails_helper'

RSpec.describe User, type: :model do

  subject(:user) do
    User.create({
      username: 'gabrielta',
      password: 'beeswhacksnotyours'
    })
  end

  describe 'password encryption' do
    it 'does not save passwords to the database' do
      User.create!({
        username: 'gabrieltl',
        password: 'beeswhacksnotyours'
      })
      user = User.find_by_username('gabrieltl')
      expect(user.password).not_to be('beeswhacksnotyours')
    end

    it 'creates a password digest when a password is given' do
      expect(user.password_digest).to_not be_nil
    end

    it 'creates a session token before validation' do
      expect(user.session_token).to_not be_nil
    end
  end

  describe '#reset_session_token' do
    it 'sets a new session token on the user' do
      old_session_token = user.session_token
      user.reset_session_token!

      expect(user.session_token).to_not eq(old_session_token)
    end

    it 'returns new session token' do
      expect(user.reset_session_token!).to eq(user.session_token)
    end
  end

  it { should validate_presence_of(:username) }
  it { should validate_presence_of(:password_digest) }
  it { should validate_length_of(:password).is_at_least(6) }

  it { should have_many(:likes) }
  it { should have_many(:followers) }
  it { should have_many(:following) }
  it { should have_many(:stories) }
  it { should have_many(:comments) }
end
