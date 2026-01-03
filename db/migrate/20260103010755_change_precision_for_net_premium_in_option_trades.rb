class ChangePrecisionForNetPremiumInOptionTrades < ActiveRecord::Migration[8.0]
  def change
    change_column :option_trades, :net_premium, :decimal, precision: 10, scale: 4
  end
end
