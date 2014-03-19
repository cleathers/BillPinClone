# == Schema Information
#
# Table name: splits
#
#  id         :integer          not null, primary key
#  total_amt  :decimal(, )
#  des        :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Split < ActiveRecord::Base

  has_many :user_splits

end
