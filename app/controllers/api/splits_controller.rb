class Api::SplitsController < ApplicationController
  before_filter :logged_in?

  def create
    p "CURRENT_USER #{current_user.email}"
    # creates new split object
    new_split = Split.new()
    new_split.des = split_params['des']
    new_split.total_amt = split_params['amt']

    # IDs of users
    borrowers = split_params['borrowers']
    payer = split_params['payer']
    # splits total evenly across all friends
    split_amt = new_split.total_amt / borrowers.length


    # creates usersplit for payer
    payer_split = UserSplit.new()
    payer_split.split_type = 'positive'
    payer_split.amt = split_amt
    payer_split.user_id = payer

    

    begin
      ActiveRecord::Base.transaction do
        # creates Split
        new_split.save!
        payer_split.split_id = new_split['id']
        
        # creates User_split for each friend and many for current_user
        borrowers.each do |borrower|
          borrower_split = UserSplit.new()
          
          borrower_split.amt = split_amt
          borrower_split.friend_id = payer_split.id
          borrower_split.split_id = new_split['id']
          borrower_split.split_type = 'negative'
          borrower_split.user_id = borrower

          payer_split.friend_id = borrower
          
          if (borrower == current_user.id)
            p "BORROWER IS CURRENT USER!"
            return_obj = borrower_split
          end

          borrower_split.save!
          payer_split.save!
        end
      end # end transaction
    
    rescue ActiveRecord::RecordInvalid => invalid
      p 'ERROR ERROR ERROR IN API/SPLITS CONTROLLER # CREATE'
    end
    
    p payer_split
#    if return_obj.exists? && payer_split.id == current_user.id
#      return_obj = payer_split
#    end

    render :json => payer_split 
  end

  def update
  end

  def destroy
  end

  def show
  end

  def index
    @splits = UserSplit.where("friend_id = ? OR user_id = ?", current_user.id, current_user.id)
  end

  private
    def split_params
      params.permit(:des, :user_amt, :amt, :payer, 
                                    borrowers: [])
    end
end
