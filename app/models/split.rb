# == Schema Information
#
# Table name: splits
#
#  id         :integer          not null, primary key
#  total_amt  :decimal(, )
#  des        :string(255)
#  payer_id   :integer
#  created_at :datetime
#  updated_at :datetime
#



class Split < ActiveRecord::Base

  has_many :user_splits
  has_one :payer, class_name: 'User'

end
