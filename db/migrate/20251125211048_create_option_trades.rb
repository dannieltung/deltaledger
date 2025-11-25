class CreateOptionTrades < ActiveRecord::Migration[8.0]
  def change
    create_table :option_trades do |t|
      t.date :trade_date
      t.string :operation_type
      t.string :option_type
      t.string :underlying_asset
      t.string :option_code
      t.decimal :strike_price, precision: 10, scale: 2
      t.decimal :price, precision: 10, scale: 2
      t.integer :quantity
      t.decimal :premium, precision: 10, scale: 2
      t.decimal :premium_yield, precision: 5, scale: 2
      t.decimal :notional, precision: 10, scale: 2
      t.decimal :net_premium, precision: 10, scale: 2
      t.date :expiration_date
      t.date :close_date

      t.timestamps
    end
  end
end
