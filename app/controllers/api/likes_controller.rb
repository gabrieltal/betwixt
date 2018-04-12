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

  def delete
    @like = Like.find(params[:id])
    @like.destroy
    render 'api/likes/show'
  end


  private
  def like_params
    params.require(:like).permit(:user_id, :story_id)
  end
end
