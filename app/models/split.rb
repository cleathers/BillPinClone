# == Schema Information
#
# Table name: splits
#
#  id                         :integer          not null, primary key
#  total_amt                  :decimal(, )
#  des                        :string(255)
#  payer_id                   :integer
#  created_at                 :datetime
#  updated_at                 :datetime
#  receipt_photo_file_name    :string(255)
#  receipt_photo_content_type :string(255)
#  receipt_photo_file_size    :integer
#  receipt_photo_updated_at   :datetime
#




class Split < ActiveRecord::Base

  has_attached_file :receipt_photo, :styles => {
    :big => "600x600>",
    :small => "50x50#"
  }
  do_not_validate_attachment_file_type :receipt_photo

  has_many :user_splits
  has_one :payer, class_name: 'User'

end
