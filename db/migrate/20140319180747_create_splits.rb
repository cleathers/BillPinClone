class CreateSplits < ActiveRecord::Migration
  def change
    create_table :user_splits do |t|
      t.decimal :amt
      t.string  :split_type
      t.integer :user_id
      t.integer :friend_id
      t.integer :split_id

      t.timestamps
    end

    create_table :splits do |t|
      t.decimal :total_amt
      t.string  :des

      t.timestamps
    end

    add_index :user_splits, [:user_id, :friend_id]
    add_index :user_splits, [:friend_id, :user_id]
    add_index :user_splits, :split_id
  end
end
