class Api::CommentsController < ApplicationController
  before_action :require_sign_in
  skip_before_action :require_sign_in, only: [:show, :index]
  before_action :find_story, only: [:index]
  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render 'api/comments/show'
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    render 'api/comments/show'
  end

  def index
    if @story.present?
      @comments = @story.comments
      render 'api/comments/index'
    else
      render json: ['Post not found'], status: 404
    end
  end

  private
  def find_story
    @story = Story.find(params[:story_id]) unless params[:story_id].nil?
  end

  def comment_params
    params.require(:comment).permit(:body, :author_id, :story_id)
  end
end
