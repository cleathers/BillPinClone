class Api::UsersController < ApplicationController
  before_filter :logged_in?

  def index
    @friends = User.all
    @current_user = current_user
  end
  
end
