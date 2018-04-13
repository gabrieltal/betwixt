class Api::LikesController < ApplicationController
  before_action :require_sign_in
  def create
    @like = Like.new(like_params)
    if @like.save
      render 'api/likes/show'
    else
      render json: @like.errors.full_messages, status: 422
    end
  end

  def destroy
    @like = Like.find_by_user_id_and_story_id(params[:user_id], params[:story_id])
    if @like
      @like.destroy
      render 'api/likes/show'
    else
      render json: ['Error server side'], status: 404
    end
  end


  private
  def like_params
    params.require(:like).permit(:user_id, :story_id)
  end
end