class OptionSeriesCalculator
  attr_reader :option_trades, :option_code

  def initialize(user, option_code)
    @option_trades = user.option_trades
                         .where(option_code: option_code)
                         .order(created_at: :desc)
    @option_code = option_code
  end

  def calculate
    {
      option_trades: option_trades,
      option_code: option_code,
      total_notional: calculate_total_notional,
      average_net_premium: calculate_average_net_premium,
      net_position: calculate_net_position,
      latest_trade: option_trades.first,
      oldest_trade: option_trades.reorder(created_at: :asc).first,
      trade_total_sum: calculate_trade_total_sum
    }
  end

  private

  def calculate_total_notional
    buy_notional = option_trades.where(operation_type: 'buy').sum(:notional)
    sell_notional = option_trades.where(operation_type: 'sell').sum(:notional)
    buy_notional - sell_notional
  end

  def calculate_average_net_premium
    open_sells = option_trades.where(operation_type: 'sell', close_date: nil)
    total_weighted = open_sells.sum { |trade| trade.net_premium * trade.quantity }
    total_quantity = open_sells.sum(:quantity)
    total_quantity > 0 ? total_weighted / total_quantity : 0
  end

  def calculate_net_position
    buy_quantity = option_trades.where(operation_type: 'buy').sum(:quantity)
    sell_quantity = option_trades.where(operation_type: 'sell').sum(:quantity)
    buy_quantity - sell_quantity
  end

  def calculate_trade_total_sum
    oldest_trade = option_trades.reorder(created_at: :asc).first
    return 0 unless oldest_trade

    sell_total = option_trades.where(operation_type: 'sell').sum { |trade| trade.net_premium * trade.quantity }
    buy_total = option_trades.where(operation_type: 'buy').sum { |trade| trade.net_premium * trade.quantity }

    if oldest_trade.operation_type == 'sell'
      sell_total - buy_total
    else
      buy_total - sell_total
    end
  end
end
