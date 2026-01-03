import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="integer-input"
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

    // Remove tudo que não é número
    const cleanText = pastedText.replace(/[^0-9]/g, '')

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

    // Remove tudo que não é número
    let value = input.value.replace(/[^0-9]/g, '')

    // Remove zeros à esquerda, exceto se for o único caractere
    if (value.length > 1) {
      value = value.replace(/^0+/, '')
    }

    // Atualiza o valor
    input.value = value

    // Restaura a posição do cursor
    input.setSelectionRange(cursorPosition, cursorPosition)
  }
}
