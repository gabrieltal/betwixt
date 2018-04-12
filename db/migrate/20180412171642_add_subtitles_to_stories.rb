class AddSubtitlesToStories < ActiveRecord::Migration[5.1]
  def change
    add_column :stories, :subtitle, :string
  end
end
