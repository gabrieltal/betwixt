Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show, :update]
    resource :session, only: [:create, :destroy]
    resources :stories do
      resources :comments, only: [:index]
    end
    resources :comments, only: [:create, :destroy ]
    resources :likes, only: [:create ]
  end
  delete 'api/likes/:user_id/:story_id', :to => 'api/likes#destroy'
  root "static_pages#root"

end
