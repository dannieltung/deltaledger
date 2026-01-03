import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="date-input"
export default class extends Controller {
  static values = { autoFill: { type: Boolean, default: false } }

  connect() {
    // Preenche com data de hoje se estiver vazio e autoFill for true
    if (this.autoFillValue) {
      this.setDefaultDate()
    }
    // Formata o valor inicial se houver
    this.formatDate()
  }

  input(event) {
    this.formatDate()
    // Valida enquanto digita
    this.validateDate()
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

    // Valida a data após formatar
    this.validateDate()
  }

  blur(event) {
    // Valida ao sair do campo
    this.validateDate()

    // Preenche com data de hoje se o campo estiver vazio e autoFill for true
    if (this.autoFillValue) {
      this.setDefaultDate()
    }
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

  validateDate() {
    const input = this.element
    const value = input.value.trim()

    // Se estiver vazio, remove borda de erro
    if (!value) {
      input.style.borderColor = ''
      return
    }

    // Verifica se está no formato DD/MM/AA
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{2})$/
    const match = value.match(datePattern)

    if (!match) {
      // Formato inválido
      input.style.borderColor = '#dc3545'
      return
    }

    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)

    // Valida dia (01-31)
    if (day < 1 || day > 31) {
      input.style.borderColor = '#dc3545'
      return
    }

    // Valida mês (01-12)
    if (month < 1 || month > 12) {
      input.style.borderColor = '#dc3545'
      return
    }

    // Valida a data completa
    const fullYear = 2000 + year
    const date = new Date(fullYear, month - 1, day)

    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== fullYear) {
      // Data inválida (ex: 31/02/25)
      input.style.borderColor = '#dc3545'
      return
    }

    // Data válida
    input.style.borderColor = '#28a745'
  }

  setDefaultDate() {
    const input = this.element

    // Se o campo estiver vazio, preenche com a data de hoje
    if (!input.value || input.value.trim() === '') {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = String(today.getFullYear()).slice(-2)

      input.value = `${day}/${month}/${year}`
    }
  }
}
