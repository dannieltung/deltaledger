class PagesController < ApplicationController
  def home
    @option_trade = OptionTrade.new
    @option_trades = current_user.option_trades.order(trade_date: :desc) if user_signed_in?
  end
end
