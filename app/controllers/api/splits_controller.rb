class Api::SplitsController < ApplicationController

  def create
  end

  def update
  end

  def destroy
  end

  def show
  end

  def index
    @splits = Split.where(user_id: current_user.id)
  end

end
