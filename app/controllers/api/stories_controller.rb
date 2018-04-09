class Api::StoriesController < ApplicationController
  before_action :require_sign_in
  skip_before_action :require_sign_in, only: [:show, :index]
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
    @story = Story.find(params[:id])
    if @story.update_attributes(story_params)
      render 'api/stories/show'
    else
      render json: ["Story not found"], status: 404
    end
  end

  def destroy
    @story = Story.find(params[:id])
    if @story
      @story.destroy
      render 'api/stories/index'
    else
      render json: ['Story not found'], status: 404
    end
  end

  def index
    @stories = Story.all
    render 'api/stories/index'
  end

  private
  def story_params
    params.require(:story).permit(:title, :body, :author_id)
  end
end
