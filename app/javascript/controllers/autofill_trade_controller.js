import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["optionCode", "strikePrice", "expirationDate", "underlyingAsset"]
  static values = { url: String }

  connect() {
    this.timeout = null
  }

  search() {
    // Limpa o timeout anterior
    clearTimeout(this.timeout)

    const optionCode = this.optionCodeTarget.value.trim()

    // Se o campo estiver vazio, não faz nada
    if (optionCode.length === 0) {
      return
    }

    // Debounce de 500ms - só faz a requisição 500ms após o usuário parar de digitar
    this.timeout = setTimeout(() => {
      this.fetchTradeData(optionCode)
    }, 500)
  }

  async fetchTradeData(optionCode) {
    try {
      const url = `${this.urlValue}?option_code=${encodeURIComponent(optionCode)}`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      if (data.found) {
        // Preenche os campos sempre que encontrar um trade
        if (this.hasStrikePriceTarget) {
          this.strikePriceTarget.value = this.formatCurrency(data.strike_price)
          // Dispara evento de input para aplicar formatação
          this.strikePriceTarget.dispatchEvent(new Event('input', { bubbles: true }))
        }

        if (this.hasExpirationDateTarget) {
          this.expirationDateTarget.value = data.expiration_date
          // Dispara evento de input para aplicar formatação
          this.expirationDateTarget.dispatchEvent(new Event('input', { bubbles: true }))
        }

        if (this.hasUnderlyingAssetTarget) {
          this.underlyingAssetTarget.value = data.underlying_asset
          // Dispara evento de input para aplicar formatação
          this.underlyingAssetTarget.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do trade:', error)
    }
  }

  formatCurrency(value) {
    // Converte para string com 2 casas decimais e troca ponto por vírgula
    return value.toFixed(2).replace('.', ',')
  }

  disconnect() {
    clearTimeout(this.timeout)
  }
}
