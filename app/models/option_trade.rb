class OptionTrade < ApplicationRecord
  belongs_to :user
  # ENUMs para tipos fixos
  enum :option_type, { call: "call", put: "put" }

  validates :trade_date, presence: true
  validates :option_type, presence: true
  validates :quantity, numericality: { greater_than: 0 }
end
