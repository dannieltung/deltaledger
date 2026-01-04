class OptionTrade < ApplicationRecord
  belongs_to :user
  # ENUMs para tipos fixos
  enum :option_type, { call: "call", put: "put" }

  validates :trade_date, presence: true
  validates :option_type, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :operation_type, inclusion: { in: %w[buy sell], allow_nil: true }

  before_validation :calculate_net_premium
  before_validation :calculate_notional
  before_validation :calculate_premium_yield

  # Scope de busca por underlying_asset e option_code
  scope :search, ->(query) {
    return all if query.blank?

    normalized_query = query.strip.upcase
    where(
      "UPPER(underlying_asset) LIKE :query OR UPPER(option_code) LIKE :query",
      query: "%#{normalized_query}%"
    )
  }

  # Scopes de filtro
  scope :by_trade_date_range, ->(start_date, end_date) {
    return all if start_date.blank? && end_date.blank?

    if start_date.present? && end_date.present?
      where(trade_date: start_date..end_date)
    elsif start_date.present?
      where("trade_date >= ?", start_date)
    elsif end_date.present?
      where("trade_date <= ?", end_date)
    end
  }

  scope :by_operation_type, ->(operation_type) {
    return all if operation_type.blank?
    where(operation_type: operation_type)
  }

  scope :by_option_type, ->(option_type) {
    return all if option_type.blank?
    where(option_type: option_type)
  }

  scope :by_underlying_asset, ->(underlying_asset) {
    return all if underlying_asset.blank?
    where("UPPER(underlying_asset) = ?", underlying_asset.strip.upcase)
  }

  scope :by_expiration_date_range, ->(start_date, end_date) {
    return all if start_date.blank? && end_date.blank?

    if start_date.present? && end_date.present?
      where(expiration_date: start_date..end_date)
    elsif start_date.present?
      where("expiration_date >= ?", start_date)
    elsif end_date.present?
      where("expiration_date <= ?", end_date)
    end
  }

  # Scope de ordenação customizada com suporte para múltiplos atributos
  scope :custom_sort, ->(sort_params) {
    return order(trade_date: :desc) if sort_params.blank?

    # Atributos permitidos para ordenação
    allowed_attributes = %w[trade_date option_code expiration_date notional]

    # Array para armazenar as cláusulas de ordenação
    order_clauses = []

    # Processa cada parâmetro de ordenação
    sort_params.each do |attr, direction|
      next unless allowed_attributes.include?(attr.to_s)
      next unless %w[asc desc].include?(direction.to_s.downcase)

      order_clauses << "#{attr} #{direction.upcase}"
    end

    # Se não houver cláusulas válidas, usa ordenação padrão
    return order(trade_date: :desc) if order_clauses.empty?

    # Aplica todas as cláusulas de ordenação
    order(Arel.sql(order_clauses.join(", ")))
  }

  private

  # Calcula o prêmio líquido com taxa de 0.134%
  # - Compra: adiciona taxa ao prêmio (custo maior)
  # - Venda: subtrai taxa do prêmio (recebe menos)
  def calculate_net_premium
    return if premium.nil? || operation_type.nil?

    self.net_premium = case operation_type
    when "buy"
      premium * BigDecimal("1.00134")
    when "sell"
      premium * BigDecimal("0.99866")
    else
      nil
    end
  end

  # Calcula o valor notional (quantidade × strike price)
  def calculate_notional
    return if quantity.nil? || strike_price.nil?

    self.notional = quantity * strike_price
  end

  # Calcula o yield do prêmio em porcentagem (net_premium / strike_price × 100)
  def calculate_premium_yield
    return if net_premium.nil? || strike_price.nil? || strike_price.zero?

    self.premium_yield = (net_premium / strike_price) * 100
  end
end
