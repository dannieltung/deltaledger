class PagesController < ApplicationController
  def home
    @option_trade = OptionTrade.new
    if user_signed_in?
      @option_trades = current_user.option_trades
                                   .search(params[:q])
                                   .custom_sort(sort_params)
    end
  end

  private

  def sort_params
    params.fetch(:sort, {}).permit(:trade_date, :option_code, :expiration_date, :notional)
  end
end
