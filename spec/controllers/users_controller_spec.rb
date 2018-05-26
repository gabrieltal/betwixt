require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  render_views

  let(:json) { JSON.parse(response.body) }

  describe 'POST #create' do
    context 'with valid params' do
      it 'validates the presence of username and password' do
        post :create, format: :json, params: {user: {username: 'gabriel_tal', password:'beeswhacksnotyours', image: '', bio: ''}}
        expect(User.last.username).to eq('gabriel_tal')
      end

      it 'logs in the user' do
        post :create, format: :json, params: {user: {username: 'gabriel_tal', password:'beeswhacksnotyours', image: '', bio: ''}}
        user = User.find_by_username('gabriel_tal')

        expect(session[:session_token]).to eq(user.session_token)
      end
    end

    context 'with invalid params' do
      it 'responds with 422' do
        post :create, format: :json, params: {user: {username: 'gabe', password: ''}}
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'GET #index with a tag' do
    context 'with valid search param' do
      it 'returns valid users with usernames matching search tag' do
        users = User.containing("gabriel")
        expect(users.length).to be >=(1)
      end
    end

    context 'with invalid search params (ie no found users)' do
      it 'returns No Users Found upon search failing' do
        users = User.containing('zyzzzzz')
        expect(users.length).to be(0)
      end
    end
  end
end
