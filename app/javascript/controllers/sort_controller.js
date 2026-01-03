import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "chevron"]

  connect() {
    // Inicializa o estado dos selects baseado nos checkboxes
    this.updateSelectsState()
    // Começa colapsado
    this.contentTarget.style.display = "none"
  }

  toggle() {
    const isHidden = this.contentTarget.style.display === "none"

    if (isHidden) {
      this.contentTarget.style.display = "block"
      this.chevronTarget.classList.remove("bi-chevron-down")
      this.chevronTarget.classList.add("bi-chevron-up")
    } else {
      this.contentTarget.style.display = "none"
      this.chevronTarget.classList.remove("bi-chevron-up")
      this.chevronTarget.classList.add("bi-chevron-down")
    }
  }

  toggleField(event) {
    const checkbox = event.target
    const fieldName = checkbox.name.match(/\[(\w+)\]/)[1]
    const select = this.element.querySelector(`select[name="sort[${fieldName}]"]`)

    if (select) {
      select.disabled = !checkbox.checked

      // Se desmarcou, remove o valor do checkbox
      if (!checkbox.checked) {
        checkbox.value = ""
      }
    }
  }

  updateSelectsState() {
    const checkboxes = this.element.querySelectorAll('input[type="checkbox"]')

    checkboxes.forEach(checkbox => {
      const fieldName = checkbox.name.match(/\[(\w+)\]/)[1]
      const select = this.element.querySelector(`select[name="sort[${fieldName}]"]`)

      if (select) {
        select.disabled = !checkbox.checked
      }
    })
  }
}
