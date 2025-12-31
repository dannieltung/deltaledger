import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="option-code"
export default class extends Controller {
  connect() {
    // Formata o valor inicial se houver
    this.formatValue()
  }

  input(event) {
    this.formatValue()
  }

  paste(event) {
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData('text')

    // Remove tudo que não é letra ou número e converte para maiúscula
    const cleanText = pastedText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

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

    // Remove tudo que não é letra ou número
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '')

    // Converte para maiúscula
    value = value.toUpperCase()

    // Atualiza o valor
    input.value = value

    // Restaura a posição do cursor
    input.setSelectionRange(cursorPosition, cursorPosition)
  }
}
