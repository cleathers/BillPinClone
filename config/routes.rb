BillPinClone::Application.routes.draw do
  root to: 'home#index'
  devise_for :users
  
  # Route for Guest user
  post '/users/guest', to: 'application#current_or_guest_user'

  namespace :api do
    resources :splits, defaults: { format: 'json' }
    get '/users', to: 'users#index'
  end

end
