class AddUserToOptionTrades < ActiveRecord::Migration[8.0]
  def change
    add_reference :option_trades, :user, null: false, foreign_key: true
  end
end
