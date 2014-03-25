class Api::HistoriesController < ApplicationController
  before_filter :authenticate_user!
  def index
    @histories = Split.all
  end
end
