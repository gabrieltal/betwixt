class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?

  private
    def logged_in?
      !!current_user
    end

    def login(user)
      user.reset_session_token!
      session[:session_token] = user.session_token
      @current_user = user
    end

    def signout
      current_user.reset_session_token!
      session[:session_token] = nil
      @current_user = nil
    end

    def require_sign_in
      unless current_user
        render json: { base: ['invalid, sign in required'] }, status: 401
      end
    end

    def current_user
      @current_user ||= User.find_by(session_token: session[:session_token])
    end
end
