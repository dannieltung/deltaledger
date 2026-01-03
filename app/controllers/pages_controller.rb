class PagesController < ApplicationController
  def home
    @option_trade = OptionTrade.new
    if user_signed_in?
      @option_trades = current_user.option_trades
                                   .search(params[:q])
                                   .order(trade_date: :desc)
    end
  end
end
