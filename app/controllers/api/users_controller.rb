class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      login(@user)
      render 'api/users/show'
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.find(params[:id])
    if @user
      render 'api/users/show'
    else
      render json: ['User not found'], status: 404
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.id === 1
      render json: ['Sorry but you cannot update the guest. Create your own account if you wish to use this feature'], status: 422
    elsif @user.update_attributes(user_params)
      render 'api/users/show'
    else
      render json: ["Could not update"], status: 422
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :image, :bio)
  end
end
