class OptionTrade < ApplicationRecord
  belongs_to :user
  # ENUMs para tipos fixos
  enum :operation_type, { buy: "buy", sell: "sell" }
  enum :option_type, { call: "call", put: "put" }

  validates :trade_date, presence: true
  validates :operation_type, presence: true
  validates :option_type, presence: true
  validates :quantity, numericality: { greater_than: 0 }
end
