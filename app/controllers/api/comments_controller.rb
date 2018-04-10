class Api::CommentsController < ApplicationController
  before_action :require_sign_in
  skip_before_action :require_sign_in, only: [:show, :index]

  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render 'api/comments/show'
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def show
    @comment = Comment.find(params[:id])
    if @comment
      render 'api/comments/show'
    else
      render json: ['Comment not found'], status: 404
    end
  end

  def update
    @comment = Comment.find(params[:id])
    if @comment.update_attributes(comment_params)
      render 'api/comments/show'
    else
      render json: ["Comment not found"], status: 404
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    render 'api/comments/show'
  end

  def index
    @comments = Comment.all
    render 'api/comments/index'
  end

  private
  def comment_params
    params.require(:comment).permit(:body, :author_id, :story_id)
  end
end
