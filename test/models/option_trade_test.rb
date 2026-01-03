require "test_helper"

class OptionTradeTest < ActiveSupport::TestCase
  test "should not save without trade_date" do
    option_trade = OptionTrade.new(user: users(:one))
    assert_not option_trade.save
  end

  test "should save with valid attributes" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100
    )
    assert option_trade.save
  end

  # Testes para cálculo de net_premium

  test "should calculate net_premium for buy operation" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100,
      premium: 100.00
    )
    option_trade.save

    # Buy: premium * 1.00134
    expected = BigDecimal("100.00") * BigDecimal("1.00134")
    assert_in_delta expected, option_trade.net_premium, 0.01
  end

  test "should calculate net_premium for sell operation" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "sell",
      option_type: "put",
      quantity: 100,
      premium: 100.00
    )
    option_trade.save

    # Sell: premium * 0.99866
    expected = BigDecimal("100.00") * BigDecimal("0.99866")
    assert_in_delta expected, option_trade.net_premium, 0.01
  end

  test "should set net_premium to nil when premium is nil" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100,
      premium: nil
    )
    option_trade.save

    assert_nil option_trade.net_premium
  end

  test "should set net_premium to nil when operation_type is nil" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: nil,
      option_type: "call",
      quantity: 100,
      premium: 100.00
    )
    option_trade.save

    assert_nil option_trade.net_premium
  end

  test "should handle zero premium" do
    option_trade = OptionTrade.new(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100,
      premium: 0.00
    )
    option_trade.save

    assert_equal 0.0, option_trade.net_premium.to_f
  end

  test "should recalculate net_premium when premium is updated" do
    option_trade = OptionTrade.create!(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100,
      premium: 100.00
    )

    original_net_premium = option_trade.net_premium

    option_trade.update(premium: 200.00)

    assert_not_equal original_net_premium, option_trade.net_premium
    expected = BigDecimal("200.00") * BigDecimal("1.00134")
    assert_in_delta expected, option_trade.net_premium, 0.01
  end

  test "should recalculate net_premium when operation_type changes" do
    option_trade = OptionTrade.create!(
      user: users(:one),
      trade_date: Date.today,
      operation_type: "buy",
      option_type: "call",
      quantity: 100,
      premium: 100.00
    )

    buy_net_premium = option_trade.net_premium

    option_trade.update(operation_type: "sell")

    assert_not_equal buy_net_premium, option_trade.net_premium
    expected = BigDecimal("100.00") * BigDecimal("0.99866")
    assert_in_delta expected, option_trade.net_premium, 0.01
  end
end
