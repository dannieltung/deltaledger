class PagesController < ApplicationController
  def home
    @option_trade = OptionTrade.new
    if user_signed_in?
      parsed_filters = parse_filter_dates
      @option_trades = current_user.option_trades
                                   .search(params[:q])
                                   .by_trade_date_range(parsed_filters[:trade_date_start], parsed_filters[:trade_date_end])
                                   .by_operation_type(filter_params[:operation_type])
                                   .by_option_type(filter_params[:option_type])
                                   .by_underlying_asset(filter_params[:underlying_asset])
                                   .by_expiration_date_range(parsed_filters[:expiration_date_start], parsed_filters[:expiration_date_end])
                                   .custom_sort(sort_params)
                                   .page(params[:page]).per(15)
    end
  end

  private

  def sort_params
    params.fetch(:sort, {}).permit(:trade_date, :option_code, :expiration_date, :notional)
  end

  def filter_params
    params.fetch(:filter, {}).permit(
      :trade_date_start,
      :trade_date_end,
      :operation_type,
      :option_type,
      :underlying_asset,
      :expiration_date_start,
      :expiration_date_end
    )
  end

  def parse_filter_dates
    parsed = filter_params.to_h.dup
    date_fields = [:trade_date_start, :trade_date_end, :expiration_date_start, :expiration_date_end]

    date_fields.each do |field|
      date_str = parsed[field]
      next if date_str.blank?

      begin
        # Valida formato DD/MM/AA
        unless date_str.match?(/^\d{2}\/\d{2}\/\d{2}$/)
          parsed[field] = nil
          next
        end

        day, month, year = date_str.split("/")

        if day && month && year
          # Adiciona '20' ao ano se for apenas 2 dígitos
          full_year = year.length == 2 ? "20#{year}" : year

          # Valida se a data é válida
          date = Date.new(full_year.to_i, month.to_i, day.to_i)

          parsed[field] = "#{full_year}-#{month.rjust(2, '0')}-#{day.rjust(2, '0')}"
        end
      rescue ArgumentError, Date::Error
        # Se a data for inválida, define como nil
        parsed[field] = nil
      end
    end

    parsed.symbolize_keys
  end
end
