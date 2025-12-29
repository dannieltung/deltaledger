import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["premium", "strike", "result"]

  connect() {
    console.log("Calculator controller connected!");
    this.calculate()
  }

  formatInput(event) {
    const input = event.target
    let value = input.value

    // Substitui todos os pontos por vírgulas
    value = value.replace(/\./g, ',')

    // Permite apenas uma vírgula
    const parts = value.split(',')
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('')
    }

    input.value = value
  }

  calculate() {
    const strikeValue = parseFloat(this.strikeTarget.value.replace(',', '.')) || 0
    const premiumValue = parseFloat(this.premiumTarget.value.replace(',', '.')) || 0

    if (strikeValue === 0) {
      this.resultTarget.textContent = "0,00%"
      return
    }

    const percentage = (premiumValue / strikeValue) * 100
    const formattedPercentage = percentage.toFixed(2).replace('.', ',')
    this.resultTarget.textContent = `${formattedPercentage}%`
  }
}