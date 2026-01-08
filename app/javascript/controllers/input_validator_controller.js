import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  connect() {
    // Valida todos os inputs ao conectar
    this.inputTargets.forEach(input => this.validateInput(input))
  }

  validate(event) {
    this.validateInput(event.target)
  }

  validateInput(input) {
    // Pega o valor do input
    const value = input.value.trim()

    // Remove a classe de validado primeiro
    input.classList.remove('input-filled')

    // Se o input tiver valor, adiciona a classe
    if (value !== '' && value !== '0' && value !== '0,00') {
      // Para select elements, verifica se não é a opção vazia
      if (input.tagName === 'SELECT') {
        if (value !== '') {
          input.classList.add('input-filled')
        }
      } else {
        input.classList.add('input-filled')
      }
    }
  }

  // Método para revalidar todos os inputs (útil após autofill)
  revalidateAll() {
    this.inputTargets.forEach(input => this.validateInput(input))
  }
}
