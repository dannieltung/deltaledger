import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "clearBtn"]

  connect() {
    this.toggleClearButton()
  }

  toggleClearButton() {
    if (this.hasInputTarget && this.hasClearBtnTarget) {
      const hasValue = this.inputTarget.value.trim().length > 0
      this.clearBtnTarget.style.display = hasValue ? "inline-flex" : "none"
    }
  }

  input() {
    this.toggleClearButton()
  }

  clear(event) {
    event.preventDefault()
    this.inputTarget.value = ""
    this.toggleClearButton()

    // Submit do form sem o parâmetro q
    this.element.requestSubmit()
  }
}
