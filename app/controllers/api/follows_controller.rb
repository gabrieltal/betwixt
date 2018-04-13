class Api::FollowsController < ApplicationController
  before_action :require_sign_in

  def create
    @follow = Follow.new(follow_params)
    if @follow.save
      render 'api/follows/show'
    else
      render json: @follow.errors.full_messages, status: 422
    end
  end

  def destroy
    @follow = Follow.find(params[:id])
    if @follow
      @follow.destroy
      render 'api/follows/show'
    else
      render json: ['Error in unfollow'], status: 404
    end
  end

  private

  def follow_params
    params.require(:follow).permit(:follower_id, :following_id)
  end
end
