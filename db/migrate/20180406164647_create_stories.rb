class CreateStories < ActiveRecord::Migration[5.1]
  def change
    create_table :stories do |t|
      t.text :body, null: false
      t.string :title, null: false
      t.integer :author_id

      t.timestamps
    end
    add_index(:stories, :author_id)
  end
end
