class Api::HistoriesController < ApplicationController
  def index
    @histories = Split.all
  end
end
