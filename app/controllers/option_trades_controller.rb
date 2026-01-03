class OptionTradesController < ApplicationController
  before_action :authenticate_user!
  before_action :parse_dates, only: [ :create ]
  before_action :parse_decimals, only: [ :create ]

  def portfolio
    @option_trades = current_user.option_trades.order(trade_date: :desc)
  end

  def create
    @option_trade = current_user.option_trades.build(option_trade_params)

    if @option_trade.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to root_path, notice: "Trade criado com sucesso!" }
      end
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

          # Valida formato DD/MM/AA
          unless date_str.match?(/^\d{2}\/\d{2}\/\d{2}$/)
            params[:option_trade][field] = nil
            next
          end

          day, month, year = date_str.split("/")

          if day && month && year
            # Adiciona '20' ao ano se for apenas 2 dígitos
            full_year = year.length == 2 ? "20#{year}" : year

            # Valida se a data é válida
            date = Date.new(full_year.to_i, month.to_i, day.to_i)

            params[:option_trade][field] = "#{full_year}-#{month.rjust(2, '0')}-#{day.rjust(2, '0')}"
          end
        rescue ArgumentError, Date::Error
          # Se a data for inválida, define como nil
          params[:option_trade][field] = nil
        end
      end
    end
  end

  def parse_decimals
    decimal_fields = [ :strike_price, :premium, :premium_yield, :notional ]

    decimal_fields.each do |field|
      if params[:option_trade][field].present?
        # Converte vírgula para ponto para campos decimais
        params[:option_trade][field] = params[:option_trade][field].to_s.gsub(',', '.')
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
      :expiration_date,
      :close_date
    )
  end
end
