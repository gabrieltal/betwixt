class Api::StoriesController < ApplicationController
  before_action :require_sign_in
  def create
    @story = Story.new(story_params)
    if @story.save
      render 'api/stories/show'
    else
      render json: @story.errors.full_messages, status: 422
    end
  end

  def show
    @story = Story.find(params[:id])
    if @story
      render 'api/stories/show'
    else
      render json: ['Story not found'], status: 404
    end
  end

  def update
    @story = params[:id]
    if @story
      render 'api/story/show'
    else
      render json: ["Story not found"], status: 404
    end
  end

  def destroy
    @story = params[:id]
    if @story
      render 'api/story/show'
    else
      render json: ['Story not found'], status: 404
  end

  def index
    @stories = Story.all
  end

  private
  def story_params
    params.require(:story).permit(:title, :body)
  end
end
