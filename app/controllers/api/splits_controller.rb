class Api::SplitsController < ApplicationController
  before_filter :authenticate_user!

  def create
    # creates new split object
    new_split = Split.new
    new_split.des = split_params['des']
    new_split.total_amt = split_params['totalAmt']
    new_split.payer_id = split_params['payerId']
    new_split.receipt_photo = split_params['receipt_photo']
    new_split.date = split_params['date']
    # setting blank obj for return model

    # user split details
    users = split_params['users']
    payerId = split_params['payerId']

    begin
      ActiveRecord::Base.transaction do
        # creates Split
        new_split.save!
        split_id = new_split['id']
        
        # creates User_split for each friend and many for current_user
        users.each do |user|
          user_split = UserSplit.new()
          
          user_split.amt = user['amt']
          user_split.friend_id = payerId
          user_split.split_id = split_id

          if payerId == user['userId']
            user_split.split_type = 'positive'
          else
            user_split.split_type = 'negative'
          end
          user_split.user_id = user['userId']

          user_split.save!
        end
      end # end transaction
    
    rescue ActiveRecord::RecordInvalid => invalid
      p 'ERROR ERROR ERROR IN API/SPLITS CONTROLLER # CREATE'
    end

    render :json => new_split
  end

  def update
  end

  def destroy
  end

  def show
    @split = Split.find(params[:id])
    @users = @split.user_splits

    render 'api/splits/show'
  end

  def index
    @splits = current_user.splits
    @pos_splits = UserSplit.where("user_id != ? AND friend_id = ?", current_user.id, current_user.id)
    @neg_splits= UserSplit.where("user_id = ? AND friend_id != ?", current_user.id, current_user.id)
    
    render 'api/splits/index'
  end

  private
    def split_params
      params.permit(:date, :des, :totalAmt, :payerId, :receipt_photo,
                                    users: [ :amt, :userId ])
    end
end
