import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    setTimeout(() => {
      this.element.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out"
      this.element.style.opacity = "0"
      this.element.style.transform = "translateX(100%)"

      setTimeout(() => {
        this.element.remove()
      }, 300)
    }, 2000)
  }
}
