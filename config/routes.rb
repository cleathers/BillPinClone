BillPinClone::Application.routes.draw do
  root to: 'home#index'
  devise_for :users
  
  # Route for Guest user
  post '/users/guest', to: 'application#current_or_guest_user'

  namespace :api, defaults: { format: 'json' } do
    resources :splits
  end

end
