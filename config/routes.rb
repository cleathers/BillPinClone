BillPinClone::Application.routes.draw do
  root to: 'home#index'
  devise_for :users
  post '/users/guest', to: 'application#current_or_guest_user'
end
