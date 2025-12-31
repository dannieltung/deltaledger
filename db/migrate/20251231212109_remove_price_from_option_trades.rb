class RemovePriceFromOptionTrades < ActiveRecord::Migration[8.0]
  def change
    remove_column :option_trades, :price, :decimal
  end
end
