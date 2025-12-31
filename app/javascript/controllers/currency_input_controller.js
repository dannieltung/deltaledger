import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="currency-input"
export default class extends Controller {
  connect() {
    this.formatValue()
  }

  input(event) {
    this.formatValue()
  }

  paste(event) {
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData('text')

    // Remove tudo exceto números, vírgula e ponto
    const cleanText = pastedText.replace(/[^0-9.,]/g, '')

    // Insere o texto limpo
    const input = event.target
    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = input.value

    input.value = currentValue.substring(0, start) + cleanText + currentValue.substring(end)

    // Reposiciona o cursor
    input.selectionStart = input.selectionEnd = start + cleanText.length

    // Formata após colar
    this.formatValue()
  }

  formatValue() {
    const input = this.element
    const cursorPosition = input.selectionStart
    let value = input.value

    // Substitui todos os pontos por vírgulas
    value = value.replace(/\./g, ',')

    // Remove tudo que não é número ou vírgula
    value = value.replace(/[^0-9,]/g, '')

    // Permite apenas uma vírgula
    const parts = value.split(',')
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('')
    }

    // Atualiza o valor
    input.value = value

    // Restaura a posição do cursor
    input.setSelectionRange(cursorPosition, cursorPosition)
  }
}
