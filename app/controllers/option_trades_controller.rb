class OptionTradesController < ApplicationController
  before_action :authenticate_user!

  def create
    @option_trade = current_user.option_trades.build(option_trade_params)

    if @option_trade.save
      redirect_to root_path, notice: "Trade criado com sucesso!"
    else
      redirect_to root_path, alert: "Erro ao criar trade: #{@option_trade.errors.full_messages.join(', ')}"
    end
  end

  private

  def option_trade_params
    params.require(:option_trade).permit(
      :trade_date,
      :operation_type,
      :option_type,
      :underlying_asset,
      :option_code,
      :strike_price,
      :price,
      :quantity,
      :premium,
      :premium_yield,
      :notional,
      :net_premium,
      :expiration_date,
      :close_date
    )
  end
end
