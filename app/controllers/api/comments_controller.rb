class Api::CommentsController < ApplicationController
  before_action :require_sign_in
  skip_before_action :require_sign_in, only: [:show, :index]
  before_action :find_story, only: [:index]
  def create
    check_comment = comment_params[:body]
    if check_comment.delete("<p><br></p>").strip.length == 0
      render json: ['Comment cannot be empty'], status: 422
    else
      @comment = Comment.new(comment_params)
      if @comment.save
        render 'api/comments/show'
      else
        render json: @comment.errors.full_messages, status: 422
      end
    end
  end

  def user_comments
    @user = User.find(params[:user_id]) unless params[:user_id].nil?
    if @user
      @comments = @user.comments
      render 'api/comments/index'
    else
      render json: ['User has no comments']
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
    params.require(:comment).permit(:body, :author_id, :story_id, :user_id)
  end
end
