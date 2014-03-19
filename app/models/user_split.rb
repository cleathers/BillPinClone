# == Schema Information
#
# Table name: user_splits
#
#  id         :integer          not null, primary key
#  amt        :decimal(, )
#  split_type :string(255)
#  user_id    :integer
#  friend_id  :integer
#  split_id   :integer
#  created_at :datetime
#  updated_at :datetime
#

class UserSplit < ActiveRecord::Base

  belongs_to :user
  belongs_to :friend, class_name: 'User'
  belongs_to :split

end
