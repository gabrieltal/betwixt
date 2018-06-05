require 'rails_helper'

RSpec.describe Api::StoriesController, type: :controller do
  render_views
  let (:json) { JSON.parse(response.body) }
  let (:curr_user) { User.create!(username: 'mad_tom', password: 'password123')}

  describe 'Story #create' do
    context 'when logged in' do
      before do
        allow(controller).to receive(:current_user) { curr_user }
      end

      it 'creates a new story' do
        post :create, format: :json, params: {story:
          {title: 'Things Happen', body: 'Hello', author_id: curr_user.id,
            image: '', subtitle: 'Hey there', all_tags: ['hi']}}
        expect(Story.last.title).to eq('Things Happen')
      end
    end
  end

end
