class AddNotNullConstraintToStoryAuthorIdColumn < ActiveRecord::Migration[5.1]
  def change
    change_column_null :stories, :author_id, false
  end
end
