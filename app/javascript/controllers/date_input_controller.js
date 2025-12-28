import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="date-input"
export default class extends Controller {
  connect() {
    // Adiciona o event listener para bloquear letras
    this.element.addEventListener('keypress', this.preventLetters.bind(this))
    this.element.addEventListener('paste', this.handlePaste.bind(this))
  }

  preventLetters(event) {
    // Permite apenas números e o caractere '/'
    const charCode = event.which || event.keyCode
    const char = String.fromCharCode(charCode)

    // Permite números (0-9) e barra (/)
    if (!/[0-9\/]/.test(char)) {
      event.preventDefault()
      return false
    }

    return true
  }

  handlePaste(event) {
    // Previne colar texto com letras
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData('text')

    // Remove tudo que não é número ou barra
    const cleanText = pastedText.replace(/[^0-9\/]/g, '')

    // Insere o texto limpo
    const input = event.target
    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = input.value

    input.value = currentValue.substring(0, start) + cleanText + currentValue.substring(end)

    // Reposiciona o cursor
    input.selectionStart = input.selectionEnd = start + cleanText.length
  }
}
