class Api::SplitsController < ApplicationController
  before_filter :logged_in?

  def create
    p "CURRENT_USER #{current_user.email}"
    # creates new split object
    new_split = Split.new()

    friends = split_params['friends']
    payer = split_params['payer']

    # splits total evenly across all friends
    new_split.total_amt = split_params['amt']
    split_amt = new_split.total_amt / friends.length


    new_split.des = split_params['des']

    # creates usersplit for current User
    current_user_split = UserSplit.new()
    (payer != current_user.id) ? current_user_split.split_type = 'negative' :
                                 current_user_split.split_type = 'positive'


    current_user_split.amt = split_amt
    current_user_split.user_id = current_user.id

    friend_split_type = (split_params['split_type'] == 'positive') ? 'negative' : 'positive'

    begin
      ActiveRecord::Base.transaction do
        # creates Split
        new_split.save!
        current_user_split.split_id = new_split['id']
        
        # creates User_split for each friend and many for current_user
        friends.each do |friend|
          friend_split = UserSplit.new()
          
          friend_split.amt = split_amt
          friend_split.friend_id = current_user.id
          friend_split.split_id = new_split['id']
          friend_split.split_type = friend_split_type
          friend_split.user_id = friend

          current_user_split.friend_id = friend
          
          friend_split.save!
          current_user_split.save!
        end
      end # end transaction
    
    rescue ActiveRecord::RecordInvalid => invalid
      p 'ERROR ERROR ERROR IN API/SPLITS CONTROLLER # CREATE'
    end

    render :json => current_user_split
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
      params.permit(:des, :user_amt, :amt, :split_type, :payer, 
                                    friends: [])
    end
end
