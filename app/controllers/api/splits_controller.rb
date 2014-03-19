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
    @splits = current_user.splits
  end

  private
    def split_params
      params.require(:split).permit(:des, :friends, :amount, :split_type)
    end
end
