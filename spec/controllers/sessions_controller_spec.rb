require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  render_views
  let (:json) { JSON.parse(response.body) }
  let!(:user) { User.create({ username: 'howard_zinn', password:'password'})}

  describe 'POST #create' do
    context 'with invalid credentials' do
      it 'gives 401 with non-existent user' do
        post :create, format: :json, params: {user: {username: 'william_gibson', password: 'abcdefg'}}
        expect(response.status).to eq(401)
      end

      it 'gives 401 with wrong password entry' do
        post :create, format: :json, params: {user: {username: 'howard_zinn', password:'dingus12'}}
        expect(response.status).to eq(401)
      end
    end

    context 'with valid credentials' do
      it 'logs in the user' do
        post :create, format: :json, params: {user: {username: 'howard_zinn', password: 'password'}}
        user = User.find_by_username('howard_zinn')
        expect((session[:session_token])).to eq(user.session_token)
      end
    end
  end

  describe 'DELETE #destroy' do
    before(:each) do
      post :create, format: :json, params: {user: {username: 'howard_zinn', password: 'password'}}
      @session_token = User.find_by_username('howard_zinn').session_token
    end

    it 'logs out the current user' do
      delete :destroy, format: :json
      expect(session[:session_token]).to be_nil

      user_howard = User.find_by_username('howard_zinn')
      expect(user_howard.session_token).not_to eq(@session_token)
    end
  end
end
