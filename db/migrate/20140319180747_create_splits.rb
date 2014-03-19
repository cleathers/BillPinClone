class CreateSplits < ActiveRecord::Migration
  def change
    create_table :splits do |t|
      t.decimal :amount
      t.integer :user_id
      t.integer :friend_id
      t.integer :split_id
      t.string :split_type

      t.timestamps
    end

    add_index :splits, [:user_id, :friend_id]
    add_index :splits, [:friend_id, :user_id]
    add_index :splits, :split_id
  end
end
