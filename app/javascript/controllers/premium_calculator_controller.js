import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["premiumInput", "result"]
  static values = {
    weighted: Number,    // Σ(net_premium * quantity) atual
    quantity: Number,    // Σ(quantity) atual
    netPosition: Number  // |@net_position|
  }

  connect() {
    this.calculate()
  }

  calculate() {
    const inputValue = this.premiumInputTarget.value.trim()

    if (inputValue === "" || inputValue === "0" || inputValue === "0,00") {
      this.resultTarget.textContent = "R$ 0,00"
      return
    }

    // Converte vírgula para ponto
    const premiumValue = parseFloat(inputValue.replace(',', '.'))

    if (isNaN(premiumValue)) {
      this.resultTarget.textContent = "R$ 0,00"
      return
    }

    // Calcula o novo weighted sum adicionando a operação simulada
    const newWeightedSum = this.weightedValue + (premiumValue * this.netPositionValue)

    // Calcula o novo total de quantidade
    const newQuantitySum = this.quantityValue + this.netPositionValue

    // Calcula o novo prêmio médio
    const newAverage = newQuantitySum > 0 ? newWeightedSum / newQuantitySum : 0

    // Arredonda para cima com 2 casas decimais
    const roundedAverage = Math.ceil(newAverage * 100) / 100

    // Formata o resultado
    this.resultTarget.textContent = this.formatCurrency(roundedAverage)

    // Formata o input enquanto o usuário digita
    this.formatInput()
  }

  formatInput() {
    let value = this.premiumInputTarget.value.replace(',', '.')

    // Remove caracteres não numéricos exceto ponto
    value = value.replace(/[^\d.]/g, '')

    // Garante apenas um ponto decimal
    const parts = value.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }

    // Limita a 2 casas decimais
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2)
    }

    // Substitui ponto por vírgula para exibição
    this.premiumInputTarget.value = value.replace('.', ',')
  }

  formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
}
