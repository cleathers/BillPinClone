class Api::UsersController < ApplicationController

  def index
    @friends = User.all
    @current_user = current_user
  end
  
end
