class OptionTradesController < ApplicationController
  before_action :authenticate_user!
  before_action :parse_dates, only: [ :create ]

  def create
    @option_trade = current_user.option_trades.build(option_trade_params)

    if @option_trade.save
      redirect_to root_path, notice: "Trade criado com sucesso!"
    else
      flash.now[:alert] = "Erro ao criar trade: #{@option_trade.errors.full_messages.join(', ')}"
      render "pages/home", status: :unprocessable_entity
    end
  end

  private

  def parse_dates
    date_fields = [ :trade_date, :expiration_date, :close_date ]

    date_fields.each do |field|
      if params[:option_trade][field].present?
        begin
          # Converte DD/MM/AA para YYYY-MM-DD
          date_str = params[:option_trade][field]
          day, month, year = date_str.split("/")

          if day && month && year
            # Adiciona '20' ao ano se for apenas 2 dígitos
            full_year = year.length == 2 ? "20#{year}" : year
            params[:option_trade][field] = "#{full_year}-#{month.rjust(2, '0')}-#{day.rjust(2, '0')}"
          end
        rescue
          # Se houver erro na conversão, mantém o valor original
        end
      end
    end
  end

  def option_trade_params
    params.require(:option_trade).permit(
      :trade_date,
      :operation_type,
      :option_type,
      :underlying_asset,
      :option_code,
      :strike_price,
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
