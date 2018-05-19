Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show, :update] do
      resources :likes, only: [:index]
    end
    resource :session, only: [:create, :destroy]
    resources :stories do
      resources :comments, only: [:index]
    end
    resources :comments, only: [:create, :destroy ]
    resources :likes, only: [:create ]
    resources :follows, only: [ :create, :destroy ]
  end
  delete 'api/likes/:user_id/:story_id', :to => 'api/likes#destroy'
  delete 'api/follows/:follower_id/:following_id', :to => 'api/follows#destroy'
  get 'api/comments/from/:user_id', :to => 'api/comments#user_comments', :defaults => {:format => :json}
  get 'api/stories/from/:author_id', :to => 'api/stories#user_stories', :defaults => {:format => :json}
  get 'api/tags/:tag', :to => 'api/stories#index', as: 'tag', :defaults => {:format => :json}
  root "static_pages#root"

end
