class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_or_guest_user

  def current_or_guest_user
    if current_user
      if session[:guest_user_id]
        guest_user.destroy
        session[:guest_user_id] = nil
      end
      current_user
    else
      guest_user
      redirect_to root_url
    end
  end

  def guest_user
    @cached_guest_user ||= User.find(session[:guest_user_id] ||= create_guest_user.id)

    rescue ActiveRecord::RecordNotFound # if session[:guest_user_id] invalid
      session[:guest_user_id] = nil
      guest_user
  end

  def logged_in?
    if !current_user
      redirect_to root_url
      return
    end
  end

  private

  def create_guest_user
    u = User.create(email: "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save!(validate: false)
    session[:guest_user_id] = u.id
    u
  end
end
