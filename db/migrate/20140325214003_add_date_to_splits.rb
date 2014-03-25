class AddDateToSplits < ActiveRecord::Migration
  def change
    change_table :splits do |t|
      t.date :date
    end
  end
end
