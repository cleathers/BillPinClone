class Api::UsersController < ApplicationController
  before_filter :logged_in?

  def index
    @friends = User.where.not(id: current_user.id);
  end
  
end
