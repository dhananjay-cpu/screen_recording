class CreateRecordings < ActiveRecord::Migration[7.1]
  def change
    create_table :recordings do |t|
      t.string :key, null: false

      t.timestamps
      add_index :recordings, :key, unique: true 
    end
  end
end
