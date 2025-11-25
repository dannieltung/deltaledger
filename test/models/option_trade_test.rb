require "test_helper"

class OptionTradeTest < ActiveSupport::TestCase
  test "should not save without trade_date" do
    option_trade = OptionTrade.new
    assert_not option_trade.save
  end

  test "should save with valid attributes" do
    option_trade = OptionTrade.new(
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100
    )
    assert option_trade.save
  end
end
