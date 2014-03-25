class AddAttachmentReceiptPhotoToSplits < ActiveRecord::Migration
  def self.up
    change_table :splits do |t|
      t.attachment :receipt_photo
    end
  end

  def self.down
    drop_attached_file :splits, :receipt_photo
  end
end
