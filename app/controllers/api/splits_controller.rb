class Api::SplitsController < ApplicationController
  before_filter :logged_in?

  def create
    # creates new split object
    new_split = Split.new()

    p split_params
    p friend_params

    new_split.total_amt = split_params['amt']
    new_split.des = split_params['des']

    # creates usersplit for current User
    current_user_split = UserSplit.new()

    current_user_split.amt = split_params['user_amt']
    current_user_split.split_type = split_params['split_type']
    current_user_split.user_id = current_user.id

    friend_split_type = (split_params['split_type'] == 'positive') ? 'negative' : 'positive'

    begin
      ActiveRecord::Base.transaction do
        # creates Split
        new_split.save!
        current_user_split.split_id = new_split['id']
        
        # creates User_split for each friend and many for current_user
        friend_params.each do |friend|
          friend_split = UserSplit.new()
          
          friend_split.amt = friend['amt']
          friend_split.friend_id = current_user.id
          friend_split.split_id = new_split['id']
          friend_split.split_type = friend_split_type
          friend_split.user_id = friend['id']

          current_user_split.friend_id = friend['id']
          
          friend_split.save!
          current_user_split.save!
        end
      end # end transaction
    
    rescue ActiveRecord::RecordInvalid => invalid
      p 'ERROR ERROR ERROR IN API/SPLITS CONTROLLER # CREATE'
    end

    head :ok
  end

  def update
  end

  def destroy
  end

  def show
  end

  def index
    p current_user.user_splits
    @splits = current_user.user_splits
  end

  private
    def split_params
      params.require(:split).permit(:des, :user_amt, :amt, :split_type)
    end

    def friend_params
      params.permit(:friends => [:amt, :id]).require(:friends)
    end
end
