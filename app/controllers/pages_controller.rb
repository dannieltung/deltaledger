class PagesController < ApplicationController
  def home
    @option_trade = OptionTrade.new
  end
end
