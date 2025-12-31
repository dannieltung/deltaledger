import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="date-input"
export default class extends Controller {
  connect() {
    // Formata o valor inicial se houver
    this.formatDate()
  }

  input(event) {
    this.formatDate()
  }

  paste(event) {
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData('text')

    // Remove tudo que não é número
    const cleanText = pastedText.replace(/[^0-9]/g, '')

    // Insere o texto limpo
    const input = event.target
    input.value = cleanText

    // Formata após colar
    this.formatDate()
  }

  formatDate() {
    const input = this.element
    let value = input.value

    // Remove tudo que não é número
    value = value.replace(/[^0-9]/g, '')

    // Limita a 6 dígitos
    value = value.substring(0, 6)

    // Formata como DD/MM/AA
    let formatted = ''
    if (value.length > 0) {
      // Adiciona os dois primeiros dígitos (dia)
      formatted = value.substring(0, 2)

      if (value.length >= 3) {
        // Adiciona barra e os próximos dois dígitos (mês)
        formatted += '/' + value.substring(2, 4)
      }

      if (value.length >= 5) {
        // Adiciona barra e os últimos dois dígitos (ano)
        formatted += '/' + value.substring(4, 6)
      }
    }

    // Atualiza o valor apenas se mudou
    if (input.value !== formatted) {
      input.value = formatted
    }
  }
}
